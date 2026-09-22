import express from 'express';
import {
  getProductReviews,
  createReview,
  getAllReviews,
  toggleReviewApproval,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', createReview);

// Admin
router.get('/admin/all', protect, authorize('admin'), getAllReviews);
router.put('/admin/:id/toggle-approve', protect, authorize('admin'), toggleReviewApproval);
router.delete('/admin/:id', protect, authorize('admin'), deleteReview);

export default router;
