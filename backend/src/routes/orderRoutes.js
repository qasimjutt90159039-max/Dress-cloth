import express from 'express';
import {
  createOrder,
  uploadPaymentProof,
  getOrderById,
  trackOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  printOrderInvoice
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public & Customer routes
router.post('/', createOrder);
router.post('/:id/payment-proof', upload.single('paymentProof'), uploadPaymentProof);
router.post('/track', trackOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id/invoice', printOrderInvoice);
router.get('/:id', getOrderById);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/admin/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
