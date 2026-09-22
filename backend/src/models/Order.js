import mongoose from 'mongoose';
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../config/constants.js';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String, default: 'Standard' },
  color: { type: String, default: 'Default' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true }
}, { _id: false });

const timelineEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    apartment: { type: String, default: '' },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, default: '' }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  couponApplied: {
    code: { type: String, default: null },
    discountAmount: { type: Number, default: 0 }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: PAYMENT_METHODS,
    default: 'Cash on Delivery'
  },
  paymentStatus: {
    type: String,
    enum: PAYMENT_STATUSES,
    default: 'Pending'
  },
  paymentProof: {
    type: String,
    default: null
  },
  orderStatus: {
    type: String,
    enum: ORDER_STATUSES,
    default: 'Pending'
  },
  trackingNumber: {
    type: String,
    default: ''
  },
  courierName: {
    type: String,
    default: 'TCS Pakistan'
  },
  customerNotes: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  },
  timeline: [timelineEventSchema]
}, {
  timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
