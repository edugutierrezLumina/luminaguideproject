import { Router } from 'express';
import { createForumPost, getApprovedPosts, getPostById, addReply, getPendingPosts, moderatePost, deletePost } from '../controllers/forumController';
import { auth } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
const router = Router();
router.post('/posts', createForumPost);
router.get('/posts', getApprovedPosts);
router.get('/posts/:id', getPostById);
router.post('/posts/:id/replies', auth, authorize('therapist'), addReply);
router.get('/admin/posts/pending', auth, authorize('admin'), getPendingPosts);
router.put('/admin/posts/:id/moderate', auth, authorize('admin'), moderatePost);
router.delete('/admin/posts/:id', auth, authorize('admin'), deletePost);
export default router;
//# sourceMappingURL=forumRoutes.js.map