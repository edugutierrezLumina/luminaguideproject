import { Router } from 'express';
import { 
  getAllTherapistsPublic,
  getTherapistByIdPublic,
  createTherapist,
  getAllTherapistsAdmin,
  updateTherapist,
  deleteTherapist,
  hardDeleteTherapist, 
  toggleTherapistStatus, 
  getMyProfile,
  updateMyProfile,
  getAvailableFilters 
} from '../controllers/therapistController';
import { auth } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { uploadTherapistImage } from '../middleware/upload'; // ✅ IMPORTAR

const router = Router();

// RUTAS PÚBLICAS (sin autenticación)
router.get('/public', getAllTherapistsPublic);
router.get('/public/:id', getTherapistByIdPublic);
router.get('/filters', getAvailableFilters);

// RUTAS PROTEGIDAS - THERAPIST (propias)
router.get('/profile', auth, getMyProfile);
router.put(
  '/profile', 
  auth, 
  uploadTherapistImage.single('profileImage'), // ✅ AGREGAR MULTER
  updateMyProfile
);

// RUTAS PROTEGIDAS - ADMIN
router.post(
  '/', 
  auth, 
  authorize('admin'), 
  uploadTherapistImage.single('profileImage'),
  createTherapist
);

router.get('/admin/all', auth, authorize('admin'), getAllTherapistsAdmin);

router.put(
  '/:id', 
  auth, 
  authorize('admin'), 
  uploadTherapistImage.single('profileImage'), 
  updateTherapist
);

// Cambiar estado activo/inactivo (soft delete)
router.patch('/:id/toggle-status', auth, authorize('admin'), toggleTherapistStatus);

// Eliminación PERMANENTE (hard delete)
router.delete('/:id', auth, authorize('admin'), hardDeleteTherapist);

export default router;