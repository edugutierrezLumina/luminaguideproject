import express from 'express';
import {
  createBlogPost,
  getAllBlogPosts,
  getPublishedBlogPosts,
  getBlogPostById, // ✅ AGREGAR si no existe
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blogController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { upload } from '../middleware/upload';

const router = express.Router();


router.get('/published', getPublishedBlogPosts);
router.get('/published/:id', getBlogPostById); // ✅ NUEVA - para ver post individual


router.post('/', authenticate, authorize('admin'), upload.array('files', 10), createBlogPost);
router.get('/', authenticate, authorize('admin'), getAllBlogPosts);
router.put('/:id', authenticate, authorize('admin'), updateBlogPost);
router.delete('/:id', authenticate, authorize('admin'), deleteBlogPost);

export default router;