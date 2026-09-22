import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  isVerifiedBuyer: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate average product rating on review save
reviewSchema.statics.calculateProductAverageRating = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews
      });
    } else {
      await mongoose.model('Product').findByIdAndUpdate(productId, {
        rating: 5.0,
        numReviews: 0
      });
    }
  } catch (err) {
    console.error('Error updating product review aggregate:', err);
  }
};

reviewSchema.post('save', function() {
  this.constructor.calculateProductAverageRating(this.product);
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
