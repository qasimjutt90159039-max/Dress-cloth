import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Settings from '../models/Settings.js';
import { generateInvoiceHtml } from '../services/invoiceService.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/emailService.js';
import { BUSINESS_INFO } from '../config/constants.js';

// Helper to generate sequential order number
const generateOrderNumber = async () => {
  const currentYear = new Date().getFullYear();
  const count = await Order.countDocuments();
  const sequence = String(count + 1).padStart(6, '0');
  return `HED-${currentYear}-${sequence}`;
};

/**
 * @desc    Create new customer order (guest or authenticated)
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      items,
      paymentMethod,
      customerNotes,
      couponCode,
      discountAmount = 0
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart has no items.' });
    }

    if (!customer || !customer.name || !customer.phone || !customer.streetAddress || !customer.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full delivery information including recipient name, phone, address, and city.'
      });
    }

    // Verify stock and calculate subtotal securely
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.title} not found.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Only ${product.stock} items remaining.`
        });
      }

      const activePrice = (product.onSale && product.salePrice) ? product.salePrice : product.price;
      const lineTotal = activePrice * item.quantity;
      subtotal += lineTotal;

      verifiedItems.push({
        product: product._id,
        title: product.title,
        image: item.image || product.images[0]?.url || '',
        size: item.size || 'Standard',
        color: item.color || 'Default',
        price: activePrice,
        quantity: item.quantity,
        total: lineTotal
      });

      // Auto-decrement inventory stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Determine Shipping Fee
    let shippingFee = 250;
    const settings = await Settings.findOne();
    if (settings) {
      if (subtotal >= settings.freeShippingThreshold) {
        shippingFee = 0;
      } else {
        const cityMatch = settings.shippingRates?.find(
          r => r.city.toLowerCase() === customer.city.trim().toLowerCase()
        );
        shippingFee = cityMatch ? cityMatch.rate : settings.defaultShippingFee;
      }
    } else if (subtotal >= 5000) {
      shippingFee = 0;
    }

    const finalDiscount = Number(discountAmount) || 0;
    const totalAmount = Math.max(0, subtotal + shippingFee - finalDiscount);
    const orderNumber = await generateOrderNumber();

    const newOrder = await Order.create({
      orderNumber,
      user: req.user ? req.user._id : null,
      customer,
      items: verifiedItems,
      subtotal,
      shippingFee,
      discount: finalDiscount,
      couponApplied: couponCode ? { code: couponCode, discountAmount: finalDiscount } : { code: null, discountAmount: 0 },
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Under Review',
      orderStatus: 'Pending',
      customerNotes: customerNotes || '',
      timeline: [
        {
          status: 'Pending',
          note: `Order registered via ${paymentMethod}. Awaiting processing.`
        }
      ]
    });

    // Send confirmation email asynchronously
    sendOrderConfirmationEmail(newOrder).catch(err => console.error('Email error:', err.message));

    // Construct WhatsApp order inquiry link for the customer
    const encodedMsg = encodeURIComponent(
      `As-salamu alaykum! I placed order #${orderNumber} for Rs. ${totalAmount.toLocaleString()} at Hand Embroidered Dresses Multan. Please confirm receipt.`
    );
    const whatsAppNotificationUrl = `https://wa.me/${BUSINESS_INFO.phone}?text=${encodedMsg}`;

    res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully!',
      order: newOrder,
      whatsAppNotificationUrl
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload payment proof for JazzCash/EasyPaisa/Bank Transfer
 * @route   POST /api/orders/:id/payment-proof
 * @access  Public
 */
export const uploadPaymentProof = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a receipt screenshot or transaction slip.' });
    }

    order.paymentProof = `/uploads/${req.file.filename}`;
    order.paymentStatus = 'Under Review';
    order.timeline.push({
      status: order.orderStatus,
      note: 'Customer uploaded payment proof slip for verification.'
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment proof uploaded successfully. Our accounts team in Multan will verify your payment.',
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Track order by Order Number and Phone
 * @route   POST /api/orders/track
 * @access  Public
 */
export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, phone } = req.body;
    if (!orderNumber || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide both Order Number and Phone number.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const order = await Order.findOne({
      orderNumber: orderNumber.trim().toUpperCase()
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'No order matches this Order Number.' });
    }

    const customerPhoneClean = order.customer.phone.replace(/[^0-9]/g, '').slice(-10);
    if (customerPhoneClean !== cleanPhone) {
      return res.status(401).json({ success: false, message: 'Phone number does not match the recipient on record.' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: List all orders with filters
 * @route   GET /api/orders/admin/all
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { 'customer.city': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * pageSize;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).sort('-createdAt').skip(skip).limit(pageSize);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNum,
      orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Update order status & add tracking
 * @route   PUT /api/orders/admin/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, courierName, adminNotes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (courierName) order.courierName = courierName;
    if (adminNotes) order.adminNotes = adminNotes;

    // Inventory replenishment if cancelled
    if (orderStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    // Add to timeline
    if (orderStatus && orderStatus !== previousStatus) {
      order.timeline.push({
        status: orderStatus,
        note: adminNotes || `Status updated to ${orderStatus}`
      });
    }

    await order.save();

    // Dispatch email notification
    sendOrderStatusEmail(order).catch(err => console.error('Status email error:', err.message));

    res.status(200).json({
      success: true,
      message: `Order #${order.orderNumber} updated to ${order.orderStatus}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate printable HTML invoice / packing slip
 * @route   GET /api/orders/:id/invoice
 * @access  Public
 */
export const printOrderInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send('<h2>Order not found</h2>');
    }

    const invoiceHtml = generateInvoiceHtml(order);
    res.setHeader('Content-Type', 'text/html');
    res.send(invoiceHtml);
  } catch (error) {
    next(error);
  }
};
