import express from 'express';
import {
  createForumPost,
  getPendingForumPosts,
  getApprovedForumPosts,
  approveForumPost,
  deleteForumPost
} from '../controllers/forumController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// Rutas públicas
router.post('/', createForumPost);
router.get('/approved', getApprovedForumPosts);

// Rutas protegidas (admin)
router.get('/pending', authenticate, authorize('admin'), getPendingForumPosts);
router.put('/:id/approve', authenticate, authorize('admin'), approveForumPost);
router.delete('/:id', authenticate, authorize('admin'), deleteForumPost);

export default router;