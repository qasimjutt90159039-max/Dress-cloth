import express from 'express';
import {
  getBlogPosts,
  getBlogPostBySlug,
  getAllAdminBlogs,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/slug/:slug', getBlogPostBySlug);

// Admin
router.get('/admin/all', protect, authorize('admin'), getAllAdminBlogs);
router.post('/', protect, authorize('admin'), createBlogPost);
router.put('/:id', protect, authorize('admin'), updateBlogPost);
router.delete('/:id', protect, authorize('admin'), deleteBlogPost);

export default router;
