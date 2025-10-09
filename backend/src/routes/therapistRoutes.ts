import { Router } from 'express';
import { 
  getAllTherapistsPublic,
  getTherapistByIdPublic,
  createTherapist,
  getAllTherapistsAdmin,
  updateTherapist,
  deleteTherapist,
  reactivateTherapist,
  getMyProfile,
  updateMyProfile
} from '../controllers/therapistController';
import { auth } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================
router.get('/public', getAllTherapistsPublic);
router.get('/public/:id', getTherapistByIdPublic);

// ============================================
// RUTAS PROTEGIDAS - THERAPIST (propias)
// ============================================
router.get('/profile', auth, getMyProfile);
router.put('/profile', auth, updateMyProfile);

// ============================================
// RUTAS PROTEGIDAS - ADMIN
// ============================================
router.post('/', auth, authorize('admin'), createTherapist);
router.get('/admin/all', auth, authorize('admin'), getAllTherapistsAdmin);
router.put('/:id', auth, authorize('admin'), updateTherapist);
router.delete('/:id', auth, authorize('admin'), deleteTherapist);
router.patch('/:id/reactivate', auth, authorize('admin'), reactivateTherapist);

export default router;