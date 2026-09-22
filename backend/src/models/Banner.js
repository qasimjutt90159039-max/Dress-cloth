import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: 'Handcrafted in Multan'
  },
  buttonText: {
    type: String,
    default: 'Explore Collection'
  },
  link: {
    type: String,
    default: '/shop'
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
