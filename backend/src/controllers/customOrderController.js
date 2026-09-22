import CustomOrder from '../models/CustomOrder.js';

// Helper to generate request identifier
const generateCustomOrderNumber = async () => {
  const currentYear = new Date().getFullYear();
  const count = await CustomOrder.countDocuments();
  return `BESPOKE-${currentYear}-${String(count + 1).padStart(5, '0')}`;
};

export const createCustomOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      phone,
      email,
      city,
      dressType,
      fabricChoice,
      colorChoice,
      embroideryDetails,
      measurements,
      estimatedBudgetPKR,
      targetDeadline
    } = req.body;

    if (!customerName || !phone || !fabricChoice || !embroideryDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer name, phone, fabric, and embroidery requirements.'
      });
    }

    const requestNumber = await generateCustomOrderNumber();

    // Parse files if uploaded
    const referenceImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(f => referenceImages.push(`/uploads/${f.filename}`));
    }

    // Parse measurements if sent as JSON string via FormData
    let parsedMeasurements = measurements;
    if (typeof measurements === 'string') {
      try {
        parsedMeasurements = JSON.parse(measurements);
      } catch (e) {
        parsedMeasurements = {};
      }
    }

    const customOrder = await CustomOrder.create({
      requestNumber,
      user: req.user ? req.user._id : null,
      customerName,
      phone,
      email: email || '',
      city: city || 'Multan',
      dressType: dressType || 'Bridal Dress',
      fabricChoice,
      colorChoice,
      embroideryDetails,
      measurements: parsedMeasurements || {},
      referenceImages,
      estimatedBudgetPKR: Number(estimatedBudgetPKR) || 0,
      targetDeadline: targetDeadline ? new Date(targetDeadline) : null,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: `Custom order request #${requestNumber} received! Our master Multani artisan will review your design and provide a bespoke quotation.`,
      customOrder
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCustomOrders = async (req, res, next) => {
  try {
    const orders = await CustomOrder.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

export const getAllCustomOrders = async (req, res, next) => {
  try {
    const orders = await CustomOrder.find().sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

export const getCustomOrderById = async (req, res, next) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Custom order request not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const updateCustomOrderQuote = async (req, res, next) => {
  try {
    const { price, timelineDays, notes, status } = req.body;
    const order = await CustomOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Custom order request not found' });
    }

    order.adminQuotation = {
      price: price || order.adminQuotation.price,
      timelineDays: timelineDays || order.adminQuotation.timelineDays,
      notes: notes || order.adminQuotation.notes
    };

    if (status) {
      order.status = status;
    } else {
      order.status = 'quoted';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Custom order quotation updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};
