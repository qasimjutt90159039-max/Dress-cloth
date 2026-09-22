import Review from '../models/Review.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true
    }).sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, customerName, images } = req.body;

    const review = await Review.create({
      product: productId,
      user: req.user ? req.user._id : null,
      customerName: customerName || req.user?.name || 'Valued Customer',
      rating: Number(rating),
      title: title || '',
      comment,
      images: images || [],
      isApproved: true, // Auto-approved or moderated
      isVerifiedBuyer: true
    });

    res.status(201).json({ success: true, message: 'Review submitted. Thank you for your feedback!', review });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'title slug images')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

export const toggleReviewApproval = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = !review.isApproved;
    await review.save();

    res.status(200).json({ success: true, message: `Review ${review.isApproved ? 'approved' : 'hidden'}`, review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};
