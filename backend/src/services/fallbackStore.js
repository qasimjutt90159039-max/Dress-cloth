import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
  categoriesData,
  productsData,
  couponsData,
  bannersData,
  blogPostsData,
  sampleReviews
} from '../seed/seedData.js';
import { BUSINESS_INFO } from '../config/constants.js';

const settingsData = {
  storeName: BUSINESS_INFO.name,
  storePhone: BUSINESS_INFO.phone,
  storeEmail: BUSINESS_INFO.email,
  storeAddress: BUSINESS_INFO.address,
  currency: BUSINESS_INFO.currency,
  currencySymbol: BUSINESS_INFO.currencySymbol,
  freeShippingThreshold: 10000,
  standardShippingFee: 250,
  enableCashOnDelivery: true,
  enableOnlinePayment: true
};

// In-Memory Database State
const categories = categoriesData.map((c, i) => ({
  _id: `cat_${i + 1}`,
  ...c,
  createdAt: new Date(),
  updatedAt: new Date()
}));

const categoryMap = {};
categories.forEach(c => {
  categoryMap[c.slug] = c;
});

const products = productsData.map((p, i) => {
  const cat = categoryMap[p.categorySlug] || categories[0];
  const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    _id: `prod_${i + 1}`,
    ...p,
    slug,
    category: cat,
    status: 'active',
    createdAt: new Date(Date.now() - (productsData.length - i) * 3600000),
    updatedAt: new Date()
  };
});

const users = [
  {
    _id: 'usr_admin',
    name: 'Boutique Administrator',
    email: 'admin@handembroidered.pk',
    password: 'Admin@123456',
    phone: '03186229753',
    role: 'admin',
    addresses: [{
      label: 'Main Boutique',
      street: 'Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar',
      city: 'Multan',
      province: 'Punjab',
      postalCode: '66000',
      isDefault: true
    }]
  },
  {
    _id: 'usr_customer',
    name: 'Fatima Khan',
    email: 'fatima.khan@example.com',
    password: 'Customer@123',
    phone: '03123456789',
    role: 'customer',
    addresses: [{
      label: 'Home',
      street: 'House 42, Street 8, Gulgasht Colony',
      city: 'Multan',
      province: 'Punjab',
      postalCode: '60000',
      isDefault: true
    }]
  }
];

const coupons = couponsData.map((c, i) => ({
  _id: `cpn_${i + 1}`,
  ...c,
  createdAt: new Date()
}));

const banners = bannersData.map((b, i) => ({
  _id: `bnr_${i + 1}`,
  ...b,
  createdAt: new Date()
}));

const blogs = blogPostsData.map((b, i) => ({
  _id: `blg_${i + 1}`,
  ...b,
  createdAt: new Date()
}));

const reviews = [...sampleReviews];
const orders = [];
const customOrders = [];
const messages = [];
let settings = { ...settingsData };

// Helper to sign JWT
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret_multan_2026',
    { expiresIn: '30d' }
  );
};

// Authentication Extractor Helper
const getAuthUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_multan_2026');
    return users.find(u => u._id === decoded.id) || null;
  } catch (err) {
    return null;
  }
};

/**
 * Express Middleware that intercepts requests when MongoDB is offline
 */
export const fallbackApiMiddleware = (req, res, next) => {
  // If real MongoDB is connected, proceed to normal Mongoose routes
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  const { method, path } = req;

  // --- 1. Products API ---
  if (path === '/api/products' && method === 'GET') {
    const { search, category, fabric, embroideryType, inStock, onSale, sort, page = 1, limit = 12 } = req.query;
    let list = [...products];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.embroideryType && p.embroideryType.toLowerCase().includes(q)) ||
        (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }

    if (category) {
      list = list.filter(p => p.category?.slug === category || p.category?._id === category || p.categorySlug === category);
    }

    if (fabric) {
      list = list.filter(p => p.fabric && p.fabric.toLowerCase().includes(fabric.toLowerCase()));
    }

    if (embroideryType) {
      list = list.filter(p => p.embroideryType && p.embroideryType.toLowerCase().includes(embroideryType.toLowerCase()));
    }

    if (inStock === 'true') {
      list = list.filter(p => p.stock > 0);
    }

    if (onSale === 'true') {
      list = list.filter(p => p.onSale);
    }

    // Sort
    if (sort === 'price-low') {
      list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sort === 'price-high') {
      list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sort === 'popular') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = list.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      count: paginated.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products: paginated
    });
  }

  // GET Single Product by slug or ID
  const productMatch = path.match(/^\/api\/products\/(.+)$/);
  if (productMatch && method === 'GET') {
    const param = productMatch[1];
    const prod = products.find(p => p.slug === param || p._id === param);
    if (!prod) {
      return res.status(404).json({ success: false, message: 'Dress not found' });
    }
    const related = products
      .filter(p => p._id !== prod._id && p.category?.slug === prod.category?.slug)
      .slice(0, 4);

    return res.json({ success: true, product: prod, related });
  }

  // Admin Add Product
  if (path === '/api/products' && method === 'POST') {
    const newProd = {
      _id: `prod_${Date.now()}`,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    if (newProd.category && typeof newProd.category === 'string') {
      newProd.category = categories.find(c => c._id === newProd.category || c.slug === newProd.category) || categories[0];
    }
    products.unshift(newProd);
    return res.status(201).json({ success: true, product: newProd });
  }

  // Admin Update Product
  if (productMatch && method === 'PUT') {
    const id = productMatch[1];
    const idx = products.findIndex(p => p._id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...req.body, updatedAt: new Date() };
      return res.json({ success: true, product: products[idx] });
    }
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Admin Delete Product
  if (productMatch && method === 'DELETE') {
    const id = productMatch[1];
    const idx = products.findIndex(p => p._id === id);
    if (idx !== -1) {
      products.splice(idx, 1);
      return res.json({ success: true, message: 'Product deleted' });
    }
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // --- 2. Categories API ---
  if (path === '/api/categories' && method === 'GET') {
    return res.json({ success: true, count: categories.length, categories });
  }

  const categorySlugMatch = path.match(/^\/api\/categories\/slug\/([^/]+)$/);
  if (categorySlugMatch && method === 'GET') {
    const slug = categorySlugMatch[1];
    const cat = categories.find(c => c.slug === slug);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const catProducts = products.filter(p => p.category?.slug === slug || p.categorySlug === slug);
    return res.json({ success: true, category: cat, products: catProducts });
  }

  const categoryIdMatch = path.match(/^\/api\/categories\/([^/]+)$/);
  if (categoryIdMatch && method === 'GET') {
    const id = categoryIdMatch[1];
    const cat = categories.find(c => c._id === id || c.slug === id);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const catProducts = products.filter(p => p.category?.slug === cat.slug || p.categorySlug === cat.slug);
    return res.json({ success: true, category: cat, products: catProducts });
  }

  if (path === '/api/categories' && method === 'POST') {
    const newCat = {
      _id: `cat_${Date.now()}`,
      ...req.body,
      createdAt: new Date()
    };
    categories.push(newCat);
    return res.status(201).json({ success: true, category: newCat });
  }

  // --- 3. Banners API ---
  if (path === '/api/banners' && method === 'GET') {
    return res.json({ success: true, banners });
  }

  // --- 4. Blogs API ---
  if (path === '/api/blogs' && method === 'GET') {
    return res.json({ success: true, count: blogs.length, posts: blogs });
  }

  const blogMatch = path.match(/^\/api\/blogs\/slug\/(.+)$/);
  if (blogMatch && method === 'GET') {
    const slug = blogMatch[1];
    const post = blogs.find(b => b.slug === slug);
    if (!post) return res.status(404).json({ success: false, message: 'Blog not found' });
    return res.json({ success: true, post });
  }

  // --- 5. Settings API ---
  if (path === '/api/settings' && method === 'GET') {
    return res.json({ success: true, settings });
  }

  if (path === '/api/settings' && method === 'PUT') {
    settings = { ...settings, ...req.body };
    return res.json({ success: true, settings });
  }

  // --- 6. Authentication API ---
  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = req.body;
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = signToken(user);
    const userSafe = { ...user };
    delete userSafe.password;
    return res.json({ success: true, user: userSafe, token });
  }

  if (path === '/api/auth/register' && method === 'POST') {
    const { name, email, password, phone } = req.body;
    if (users.find(u => u.email.toLowerCase() === (email || '').toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }
    const newUser = {
      _id: `usr_${Date.now()}`,
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer',
      addresses: []
    };
    users.push(newUser);
    const token = signToken(newUser);
    const userSafe = { ...newUser };
    delete userSafe.password;
    return res.status(201).json({ success: true, user: userSafe, token });
  }

  if (path === '/api/auth/me' && method === 'GET') {
    const authUser = getAuthUser(req);
    if (!authUser) return res.status(401).json({ success: false, message: 'Not authorized' });
    const userSafe = { ...authUser };
    delete userSafe.password;
    return res.json({ success: true, user: userSafe });
  }

  if (path === '/api/auth/profile' && method === 'PUT') {
    const authUser = getAuthUser(req);
    if (!authUser) return res.status(401).json({ success: false, message: 'Not authorized' });
    if (req.body.name) authUser.name = req.body.name;
    if (req.body.phone) authUser.phone = req.body.phone;
    if (req.body.password) authUser.password = req.body.password;
    const userSafe = { ...authUser };
    delete userSafe.password;
    return res.json({ success: true, user: userSafe });
  }

  // --- 7. Orders API ---
  if (path === '/api/orders' && method === 'POST') {
    const authUser = getAuthUser(req);
    const orderNumber = `HED-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      _id: `ord_${Date.now()}`,
      orderNumber,
      user: authUser?._id || null,
      ...req.body,
      orderStatus: 'Pending',
      paymentStatus: req.body.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Under Review',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    orders.unshift(newOrder);
    return res.status(201).json({ success: true, order: newOrder });
  }

  if (path === '/api/orders/my-orders' && method === 'GET') {
    const authUser = getAuthUser(req);
    const userOrders = authUser ? orders.filter(o => o.user === authUser._id) : [];
    return res.json({ success: true, count: userOrders.length, orders: userOrders });
  }

  if (path === '/api/orders/track' && method === 'POST') {
    const { orderNumber, phone } = req.body;
    const found = orders.find(o =>
      o.orderNumber?.toUpperCase() === (orderNumber || '').toUpperCase() &&
      (o.shippingAddress?.phone === phone || o.shippingAddress?.whatsapp === phone)
    );
    if (!found) {
      return res.status(404).json({ success: false, message: 'No matching order found for this Order Number and Phone.' });
    }
    return res.json({ success: true, order: found });
  }

  if (path === '/api/orders/admin/all' && method === 'GET') {
    const { page = 1, limit = 12, status, search } = req.query;
    let list = [...orders];
    if (status) list = list.filter(o => o.orderStatus === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.includes(q)
      );
    }
    return res.json({
      success: true,
      total: list.length,
      totalPages: Math.ceil(list.length / limit) || 1,
      orders: list
    });
  }

  const orderIdMatch = path.match(/^\/api\/orders\/([^/]+)$/);
  if (orderIdMatch && method === 'GET') {
    const id = orderIdMatch[1];
    const ord = orders.find(o => o._id === id || o.orderNumber === id);
    if (!ord) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, order: ord });
  }

  const orderProofMatch = path.match(/^\/api\/orders\/([^/]+)\/payment-proof$/);
  if (orderProofMatch && method === 'POST') {
    const id = orderProofMatch[1];
    const ord = orders.find(o => o._id === id);
    if (ord) {
      ord.paymentProof = req.file ? `/uploads/payments/${req.file.filename}` : 'uploaded_slip_mock.jpg';
      ord.paymentStatus = 'Under Review';
    }
    return res.json({ success: true, message: 'Payment receipt uploaded successfully' });
  }

  const orderStatusMatch = path.match(/^\/api\/orders\/admin\/([^/]+)\/status$/);
  if (orderStatusMatch && method === 'PUT') {
    const id = orderStatusMatch[1];
    const ord = orders.find(o => o._id === id);
    if (ord) {
      if (req.body.orderStatus) ord.orderStatus = req.body.orderStatus;
      if (req.body.paymentStatus) ord.paymentStatus = req.body.paymentStatus;
      if (req.body.trackingNumber) ord.trackingNumber = req.body.trackingNumber;
      if (req.body.courier) ord.courier = req.body.courier;
      return res.json({ success: true, order: ord });
    }
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const invoiceMatch = path.match(/^\/api\/orders\/([^/]+)\/invoice$/);
  if (invoiceMatch && method === 'GET') {
    const id = invoiceMatch[1];
    const ord = orders.find(o => o._id === id || o.orderNumber === id) || {
      orderNumber: id,
      shippingAddress: { fullName: 'Valued Customer', city: 'Multan', phone: '03186229753' },
      items: [{ title: 'Hand Embroidered Dress', quantity: 1, price: 15000 }],
      totalAmount: 15000,
      paymentMethod: 'Cash on Delivery',
      createdAt: new Date()
    };
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Invoice #${ord.orderNumber}</title><style>body{font-family:sans-serif;padding:30px;color:#333;}.header{border-bottom:2px solid #5C061D;padding-bottom:15px;margin-bottom:20px;}</style></head>
      <body>
        <div class="header">
          <h1 style="color:#5C061D;">Hand Embroidered Dresses</h1>
          <p>Shop No. 7, Bata Wali, Hussain Agahi Bazar, Multan | 03186229753</p>
        </div>
        <h2>Invoice: ${ord.orderNumber}</h2>
        <p>Customer: ${ord.shippingAddress?.fullName} (${ord.shippingAddress?.phone})</p>
        <p>Delivery: ${ord.shippingAddress?.street || ''}, ${ord.shippingAddress?.city || 'Pakistan'}</p>
        <hr/>
        <table width="100%" border="1" cellpadding="8" style="border-collapse:collapse;">
          <tr bgcolor="#f4f4f4"><th>Item</th><th>Qty</th><th>Price</th></tr>
          ${(ord.items || []).map(i => `<tr><td>${i.title}</td><td>${i.quantity}</td><td>Rs. ${Number(i.price).toLocaleString()}</td></tr>`).join('')}
        </table>
        <h3 align="right">Total: Rs. ${Number(ord.totalAmount).toLocaleString()} (${ord.paymentMethod})</h3>
      </body>
      </html>
    `;
    return res.send(html);
  }

  // --- 8. Coupons API ---
  if (path === '/api/coupons/validate' && method === 'POST') {
    const { code, cartTotal } = req.body;
    const cpn = coupons.find(c => c.code.toUpperCase() === (code || '').toUpperCase() && c.isActive);
    if (!cpn) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }
    let discountAmount = 0;
    if (cpn.discountType === 'percentage') {
      discountAmount = Math.round((cartTotal * cpn.discountValue) / 100);
      if (cpn.maxDiscount && discountAmount > cpn.maxDiscount) discountAmount = cpn.maxDiscount;
    } else {
      discountAmount = cpn.discountValue;
    }
    return res.json({
      success: true,
      coupon: { code: cpn.code, discountAmount, discountType: cpn.discountType, discountValue: cpn.discountValue }
    });
  }

  if (path === '/api/coupons' && method === 'GET') {
    return res.json({ success: true, coupons });
  }

  // --- 9. Custom Orders (Bespoke Tailoring) API ---
  if (path === '/api/custom-orders' && method === 'POST') {
    const customOrder = {
      _id: `co_${Date.now()}`,
      orderNumber: `HED-CUS-${Date.now().toString().slice(-5)}`,
      ...req.body,
      status: 'Under Review',
      createdAt: new Date()
    };
    customOrders.unshift(customOrder);
    return res.status(201).json({
      success: true,
      message: 'Custom tailoring request submitted successfully! Our Multan master artisan will review your design.',
      customOrder
    });
  }

  if (path === '/api/custom-orders' && method === 'GET') {
    return res.json({ success: true, count: customOrders.length, customOrders });
  }

  // --- 10. Messages (Contact Us) API ---
  if (path === '/api/messages' && method === 'POST') {
    const msg = {
      _id: `msg_${Date.now()}`,
      ...req.body,
      status: 'unread',
      createdAt: new Date()
    };
    messages.unshift(msg);
    return res.status(201).json({ success: true, message: 'Your message has been sent to our Multan store team!' });
  }

  if (path === '/api/messages' && method === 'GET') {
    return res.json({ success: true, count: messages.length, messages });
  }

  // --- 11. Reviews API ---
  const reviewMatch = path.match(/^\/api\/reviews\/([^/]+)$/);
  if (reviewMatch && method === 'GET') {
    return res.json({ success: true, reviews });
  }

  if (path === '/api/reviews' && method === 'POST') {
    const rev = {
      _id: `rev_${Date.now()}`,
      ...req.body,
      createdAt: new Date()
    };
    reviews.unshift(rev);
    return res.status(201).json({ success: true, review: rev });
  }

  // If unhandled by fallback, proceed to normal route
  next();
};
