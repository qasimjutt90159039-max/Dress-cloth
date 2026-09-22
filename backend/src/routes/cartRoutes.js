import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  syncCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.delete('/clear', clearCart);
router.post('/sync', syncCart);

export default router;
