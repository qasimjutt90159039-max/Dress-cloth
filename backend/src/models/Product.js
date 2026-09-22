import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '#000000' }
}, { _id: false });

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: 'Hand embroidered dress' },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [150, 'Product title cannot exceed 150 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price in PKR is required'],
    min: [0, 'Price must be greater than 0']
  },
  salePrice: {
    type: Number,
    default: null,
    min: 0
  },
  onSale: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    default: 10,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  categorySlug: {
    type: String,
    default: ''
  },
  embroideryType: {
    type: String,
    required: [true, 'Embroidery type is required']
  },
  fabric: {
    type: String,
    required: [true, 'Fabric type is required']
  },
  sizes: [{
    type: String
  }],
  colors: [colorSchema],
  images: [imageSchema],
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  careInstructions: {
    type: String,
    default: 'Dry clean recommended to preserve delicate needlework. Alternatively, hand wash gently in cold water. Iron on low heat on reverse side.'
  },
  craftStory: {
    type: String,
    default: 'Meticulously handcrafted by generational artisans in the historic alleys of Multan, utilizing traditional needle techniques and high-grade threads.'
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for fast searching and filtering
productSchema.index({ title: 'text', description: 'text', embroideryType: 'text', fabric: 'text' });
productSchema.index({ category: 1, price: 1, onSale: 1 });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
