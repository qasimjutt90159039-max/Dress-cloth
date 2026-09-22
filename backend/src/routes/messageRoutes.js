import express from 'express';
import {
  createMessage,
  getAllMessages,
  markMessageRead,
  replyMessage,
  deleteMessage
} from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createMessage);

// Admin
router.get('/', protect, authorize('admin'), getAllMessages);
router.put('/:id/read', protect, authorize('admin'), markMessageRead);
router.put('/:id/reply', protect, authorize('admin'), replyMessage);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

export default router;
