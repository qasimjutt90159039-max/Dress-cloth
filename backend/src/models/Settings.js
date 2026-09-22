import mongoose from 'mongoose';
import { BUSINESS_INFO } from '../config/constants.js';

const shippingRateSchema = new mongoose.Schema({
  city: { type: String, required: true },
  rate: { type: Number, required: true }
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: BUSINESS_INFO.name
  },
  phone: {
    type: String,
    default: BUSINESS_INFO.phone
  },
  whatsapp: {
    type: String,
    default: BUSINESS_INFO.whatsApp
  },
  email: {
    type: String,
    default: BUSINESS_INFO.email
  },
  address: {
    type: String,
    default: BUSINESS_INFO.address
  },
  currency: {
    type: String,
    default: 'PKR'
  },
  currencySymbol: {
    type: String,
    default: 'Rs.'
  },
  defaultShippingFee: {
    type: Number,
    default: 250 // PKR standard courier rate
  },
  freeShippingThreshold: {
    type: Number,
    default: 5000 // Free delivery on orders over Rs. 5,000
  },
  shippingRates: [shippingRateSchema],
  enableCOD: {
    type: Boolean,
    default: true
  },
  enableJazzCash: {
    type: Boolean,
    default: true
  },
  jazzCashNumber: {
    type: String,
    default: '03186229753'
  },
  jazzCashTitle: {
    type: String,
    default: 'Hand Embroidered Dresses'
  },
  enableEasyPaisa: {
    type: Boolean,
    default: true
  },
  easyPaisaNumber: {
    type: String,
    default: '03186229753'
  },
  easyPaisaTitle: {
    type: String,
    default: 'Hand Embroidered Dresses'
  },
  enableBankTransfer: {
    type: Boolean,
    default: true
  },
  bankName: {
    type: String,
    default: 'Meezan Bank Ltd.'
  },
  bankAccountTitle: {
    type: String,
    default: 'Hand Embroidered Dresses'
  },
  bankAccountNumber: {
    type: String,
    default: '01020304050607'
  },
  bankIBAN: {
    type: String,
    default: 'PK92MEZN0001020304050607'
  },
  announcementBarText: {
    type: String,
    default: '✨ Nationwide Delivery Across Pakistan | Free Shipping on orders over Rs. 5,000 | Authentic Multani Hand Embroidery'
  },
  showAnnouncementBar: {
    type: Boolean,
    default: true
  },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com/handembroidereddresses.pk' },
    facebook: { type: String, default: 'https://facebook.com/handembroidereddresses.pk' },
    whatsapp: { type: String, default: 'https://wa.me/923186229753' },
    tiktok: { type: String, default: 'https://tiktok.com/@handembroidereddresses' }
  }
}, {
  timestamps: true
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
