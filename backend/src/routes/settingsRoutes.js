import express from 'express';
import {
  getSettings,
  updateSettings,
  getDashboardStats
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public settings (contact, announcements, bank/wallet info, delivery fees)
router.get('/', getSettings);

// Admin
router.put('/', protect, authorize('admin'), updateSettings);
router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);

export default router;
