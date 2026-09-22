import express from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getActiveBanners);

// Admin
router.get('/admin/all', protect, authorize('admin'), getAllBanners);
router.post('/', protect, authorize('admin'), createBanner);
router.put('/:id', protect, authorize('admin'), updateBanner);
router.delete('/:id', protect, authorize('admin'), deleteBanner);

export default router;
