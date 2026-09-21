import { Router } from 'express';
import { getAllTherapistsPublic, getTherapistByIdPublic, createTherapist, getAllTherapistsAdmin, updateTherapist, hardDeleteTherapist, toggleTherapistStatus, getMyProfile, updateMyProfile, getAvailableFilters } from '../controllers/therapistController';
import { auth } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { uploadTherapistImage } from '../middleware/upload';
const router = Router();
router.get('/public', getAllTherapistsPublic);
router.get('/public/:id', getTherapistByIdPublic);
router.get('/filters', getAvailableFilters);
router.get('/profile', auth, getMyProfile);
router.put('/profile', auth, uploadTherapistImage.single('profileImage'), updateMyProfile);
router.post('/', auth, authorize('admin'), uploadTherapistImage.single('profileImage'), createTherapist);
router.get('/admin/all', auth, authorize('admin'), getAllTherapistsAdmin);
router.put('/:id', auth, authorize('admin'), uploadTherapistImage.single('profileImage'), updateTherapist);
router.patch('/:id/toggle-status', auth, authorize('admin'), toggleTherapistStatus);
router.delete('/:id', auth, authorize('admin'), hardDeleteTherapist);
export default router;
//# sourceMappingURL=therapistRoutes.js.map