import express from 'express';
import {
  createTherapist,
  getAllTherapists,
  getTherapistById,
  updateTherapist,
  deleteTherapist
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticate);
router.use(authorize('admin'));

router.post('/therapists', createTherapist);
router.get('/therapists', getAllTherapists);
router.get('/therapists/:id', getTherapistById);
router.put('/therapists/:id', updateTherapist);
router.delete('/therapists/:id', deleteTherapist);

export default router;