/**
 * Vercel Serverless Function Handler for /api/*
 * Hand Embroidered Dresses - Multan, Pakistan
 */

import {
  categoriesData,
  productsData,
  couponsData,
  bannersData,
  blogPostsData,
  sampleReviews
} from '../backend/src/seed/seedData.js';
import { BUSINESS_INFO, EMBROIDERY_TYPES, FABRICS } from '../backend/src/config/constants.js';

// Pre-computed in-memory state
const categories = categoriesData.map((c, i) => ({
  _id: `cat_${i + 1}`,
  ...c
}));

const categoryMap = {};
categories.forEach(c => {
  categoryMap[c.slug] = c;
});

const products = productsData.map((p, i) => {
  const cat = categoryMap[p.categorySlug] || categories[0];
  const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    _id: `prod_${i + 1}`,
    ...p,
    slug,
    category: cat,
    status: 'active',
    createdAt: new Date(Date.now() - (productsData.length - i) * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

const settings = {
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

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url || '';
  const [pathname, queryString] = url.split('?');
  const cleanPath = pathname.replace(/^\/api/, '') || '/';
  const query = new URLSearchParams(queryString || '');
  const method = (req.method || 'GET').toUpperCase();
  const body = req.body || {};

  // Root or Health
  if (cleanPath === '/' || cleanPath === '/health') {
    return res.status(200).json({
      status: 'online',
      timestamp: new Date().toISOString(),
      store: BUSINESS_INFO.name,
      city: BUSINESS_INFO.city,
      phone: BUSINESS_INFO.phone
    });
  }

  // Info
  if (cleanPath === '/info') {
    return res.status(200).json({
      success: true,
      business: BUSINESS_INFO
    });
  }

  // Settings
  if (cleanPath === '/settings') {
    return res.status(200).json({
      success: true,
      settings
    });
  }

  // Categories
  if (cleanPath === '/categories' || cleanPath === '/categories/') {
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  }

  if (cleanPath.startsWith('/categories/slug/')) {
    const slug = cleanPath.replace('/categories/slug/', '');
    const cat = categories.find(c => c.slug === slug) || categories[0];
    return res.status(200).json({ success: true, category: cat });
  }

  if (cleanPath.startsWith('/categories/')) {
    const id = cleanPath.replace('/categories/', '');
    const cat = categories.find(c => c._id === id || c.slug === id) || categories[0];
    return res.status(200).json({ success: true, category: cat });
  }

  // Filter Metadata
  if (cleanPath === '/products/meta/filters') {
    return res.status(200).json({
      success: true,
      categories,
      embroideryTypes: EMBROIDERY_TYPES,
      fabrics: FABRICS,
      minPrice: 3950,
      maxPrice: 68000
    });
  }

  // Products
  if (cleanPath === '/products' || cleanPath === '/products/') {
    let result = [...products];

    const search = query.get('search');
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    const category = query.get('category');
    if (category) {
      result = result.filter(p =>
        p.categorySlug === category || (p.category && (p.category.slug === category || p.category._id === category))
      );
    }

    if (query.get('newArrival') === 'true') {
      result = result.filter(p => p.isNewArrival);
    }

    if (query.get('bestSeller') === 'true') {
      result = result.filter(p => p.isBestSeller);
    }

    if (query.get('onSale') === 'true') {
      result = result.filter(p => p.onSale);
    }

    const emb = query.get('embroideryType');
    if (emb && emb !== 'all') {
      result = result.filter(p => p.embroideryType === emb);
    }

    const fab = query.get('fabric');
    if (fab && fab !== 'all') {
      result = result.filter(p => p.fabric && p.fabric.toLowerCase().includes(fab.toLowerCase()));
    }

    const min = query.get('minPrice');
    if (min) {
      result = result.filter(p => (p.salePrice || p.price) >= Number(min));
    }

    const max = query.get('maxPrice');
    if (max) {
      result = result.filter(p => (p.salePrice || p.price) <= Number(max));
    }

    const sort = query.get('sort');
    if (sort === 'price-low') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sort === 'price-high') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const page = parseInt(query.get('page')) || 1;
    const limit = parseInt(query.get('limit')) || 12;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      success: true,
      count: result.length,
      total: result.length,
      totalPages: Math.ceil(result.length / limit) || 1,
      currentPage: page,
      products: paginated
    });
  }

  // Product by Slug
  if (cleanPath.startsWith('/products/slug/')) {
    const slug = cleanPath.replace('/products/slug/', '');
    const product = products.find(p => p.slug === slug || p.sku.toLowerCase() === slug.toLowerCase()) || products[0];
    return res.status(200).json({ success: true, product });
  }

  // Related Products
  if (cleanPath.includes('/related')) {
    const parts = cleanPath.split('/');
    const id = parts[2];
    const target = products.find(p => p._id === id);
    const related = products.filter(p => p._id !== id && (!target || p.categorySlug === target.categorySlug)).slice(0, 4);
    return res.status(200).json({ success: true, products: related.length ? related : products.slice(0, 4) });
  }

  // Product by ID
  if (cleanPath.startsWith('/products/') && method === 'GET') {
    const id = cleanPath.replace('/products/', '');
    const product = products.find(p => p._id === id || p.sku === id) || products[0];
    return res.status(200).json({ success: true, product });
  }

  // Banners & Blogs
  if (cleanPath === '/banners') {
    return res.status(200).json({ success: true, count: bannersData.length, banners: bannersData });
  }

  if (cleanPath === '/blogs') {
    return res.status(200).json({ success: true, count: blogPostsData.length, blogs: blogPostsData });
  }

  if (cleanPath.startsWith('/blogs/')) {
    const slug = cleanPath.replace('/blogs/', '');
    const blog = blogPostsData.find(b => b.slug === slug) || blogPostsData[0];
    return res.status(200).json({ success: true, blog });
  }

  // Reviews
  if (cleanPath.startsWith('/reviews/product/')) {
    const prodId = cleanPath.replace('/reviews/product/', '');
    return res.status(200).json({ success: true, reviews: sampleReviews });
  }

  if (cleanPath === '/reviews' && method === 'POST') {
    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: { _id: `rev_${Date.now()}`, ...body, isApproved: true, createdAt: new Date().toISOString() }
    });
  }

  // Coupons
  if (cleanPath === '/coupons/validate') {
    const code = (body.code || '').trim().toUpperCase();
    const coupon = couponsData.find(c => c.code === code && c.isActive);
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid or expired coupon code.' });
    }
    return res.status(200).json({ success: true, coupon });
  }

  // Orders
  if (cleanPath === '/orders' && method === 'POST') {
    const orderNum = `HED-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdOrder = {
      _id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      ...body,
      orderStatus: 'Confirmed',
      paymentStatus: body.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Under Review',
      createdAt: new Date().toISOString()
    };
    return res.status(201).json({ success: true, message: 'Order created successfully!', order: createdOrder });
  }

  if (cleanPath.startsWith('/orders/track')) {
    const { orderNumber, phone } = body;
    return res.status(200).json({
      success: true,
      order: {
        _id: 'ord_demo',
        orderNumber: orderNumber || 'HED-123456',
        items: [{ product: products[0], title: products[0].title, price: products[0].price, quantity: 1, image: products[0].images[0].url }],
        totalAmount: products[0].price,
        orderStatus: 'Processing',
        paymentStatus: 'Paid',
        shippingAddress: { fullName: 'Valued Customer', phone: phone || '03186229753', city: 'Multan', address: 'Hussain Agahi Bazar' },
        createdAt: new Date().toISOString()
      }
    });
  }

  if (cleanPath.startsWith('/orders/') && method === 'GET') {
    const id = cleanPath.replace('/orders/', '');
    return res.status(200).json({
      success: true,
      order: {
        _id: id,
        orderNumber: id.startsWith('HED-') ? id : `HED-782910`,
        items: [{ product: products[0], title: products[0].title, price: products[0].price, quantity: 1, image: products[0].images[0].url }],
        totalAmount: products[0].price,
        orderStatus: 'Confirmed',
        paymentStatus: 'Pending',
        shippingAddress: { fullName: 'Boutique Customer', phone: '03186229753', city: 'Multan', address: 'Shop No. 7, Bata Wali, Hussain Agahi' },
        createdAt: new Date().toISOString()
      }
    });
  }

  // Auth
  if (cleanPath === '/auth/login' && method === 'POST') {
    const { email } = body;
    const isAdmin = (email || '').toLowerCase().includes('admin');
    return res.status(200).json({
      success: true,
      token: 'hed_token_' + Date.now(),
      user: {
        _id: isAdmin ? 'usr_admin' : 'usr_customer',
        name: isAdmin ? 'Boutique Administrator' : 'Valued Customer',
        email: email || 'customer@handembroidered.pk',
        role: isAdmin ? 'admin' : 'customer',
        phone: '03186229753'
      }
    });
  }

  // Messages & Inquiries
  if (cleanPath === '/messages' || cleanPath === '/custom-orders') {
    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been received! Our Multan master artisans will contact you shortly.'
    });
  }

  // Default Fallback
  return res.status(200).json({
    success: true,
    message: 'Hand Embroidered Dresses API service is active.',
    products: products.slice(0, 12),
    categories
  });
}
