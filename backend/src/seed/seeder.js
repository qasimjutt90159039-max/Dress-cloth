import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';

// Models
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Banner from '../models/Banner.js';
import BlogPost from '../models/BlogPost.js';
import Review from '../models/Review.js';
import Settings from '../models/Settings.js';

// Data
import {
  categoriesData,
  productsData,
  couponsData,
  bannersData,
  blogPostsData,
  sampleReviews
} from './seedData.js';

dotenv.config();

const seedAll = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.error('[Seeder] Could not connect to database. Please check MONGODB_URI.');
      process.exit(1);
    }

    console.log('[Seeder] Clearing old records...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await Banner.deleteMany();
    await BlogPost.deleteMany();
    await Review.deleteMany();
    await Settings.deleteMany();

    console.log('[Seeder] Creating Default Users...');
    // 1. Create Admin
    const admin = await User.create({
      name: 'Boutique Administrator',
      email: 'admin@handembroidered.pk',
      password: 'Admin@123456',
      phone: '03186229753',
      role: 'admin'
    });
    console.log(`[Admin Created]: email: admin@handembroidered.pk | password: Admin@123456`);

    // 2. Create Sample Customer
    const customer = await User.create({
      name: 'Ayesha Malik',
      email: 'customer@gmail.com',
      password: 'Customer@123456',
      phone: '03001234567',
      role: 'customer',
      addresses: [
        {
          title: 'Home',
          streetAddress: 'House 42, Street 8, Phase 5, DHA',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54000',
          phone: '03001234567',
          isDefault: true
        }
      ]
    });
    console.log(`[Customer Created]: email: customer@gmail.com | password: Customer@123456`);

    // 3. Create Categories
    console.log('[Seeder] Inserting Categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // 4. Create Products with mapped Category ObjectIds
    console.log('[Seeder] Inserting 42+ Hand Embroidered Dresses...');
    const productsToInsert = productsData.map(p => {
      return {
        ...p,
        category: categoryMap[p.categorySlug] || createdCategories[0]._id
      };
    });
    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`[Products Seeded]: ${createdProducts.length} dresses successfully added to store catalog.`);

    // 5. Seed Coupons
    console.log('[Seeder] Inserting Discount Coupons...');
    await Coupon.insertMany(couponsData);

    // 6. Seed Banners
    console.log('[Seeder] Inserting Homepage Hero Banners...');
    await Banner.insertMany(bannersData);

    // 7. Seed Blog Posts
    console.log('[Seeder] Inserting Heritage Embroidery Blogs...');
    await BlogPost.insertMany(blogPostsData);

    // 8. Seed Sample Reviews on first few products
    console.log('[Seeder] Inserting Verified Customer Reviews...');
    for (let i = 0; i < Math.min(3, createdProducts.length); i++) {
      const rev = sampleReviews[i];
      if (rev) {
        await Review.create({
          ...rev,
          product: createdProducts[i]._id,
          user: customer._id
        });
      }
    }

    // 9. Seed Store Settings
    console.log('[Seeder] Initializing Store Settings & Delivery Tariffs...');
    await Settings.create({
      storeName: 'Hand Embroidered Dresses',
      phone: '03186229753',
      whatsapp: '+923186229753',
      email: 'info@handembroidered.pk',
      address: 'Shop No. 7, Bata Wali, Hussain Agahi Main Chowk Bazar, Ghali Colony, near Firdouse Market, Inner City, Multan, 66000, Pakistan',
      defaultShippingFee: 250,
      freeShippingThreshold: 5000,
      enableCOD: true,
      enableJazzCash: true,
      enableEasyPaisa: true,
      enableBankTransfer: true
    });

    console.log('=======================================================');
    console.log('🎉 Store Database Seeded Successfully!');
    console.log('Admin Login: admin@handembroidered.pk / Admin@123456');
    console.log('Customer Login: customer@gmail.com / Customer@123456');
    console.log('=======================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedAll();
