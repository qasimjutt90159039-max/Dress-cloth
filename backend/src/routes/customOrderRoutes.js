import express from 'express';
import {
  createCustomOrder,
  getMyCustomOrders,
  getAllCustomOrders,
  getCustomOrderById,
  updateCustomOrderQuote
} from '../controllers/customOrderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.array('referenceImages', 5), createCustomOrder);
router.get('/my-requests', protect, getMyCustomOrders);
router.get('/:id', getCustomOrderById);

// Admin
router.get('/admin/all', protect, authorize('admin'), getAllCustomOrders);
router.put('/admin/:id/quote', protect, authorize('admin'), updateCustomOrderQuote);

export default router;
