import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Therapist from '../models/Therapist';
import User from '../models/User';

// ============================================
// RUTAS PÚBLICAS (Sin autenticación)
// ============================================

// Obtener todos los terapeutas activos con filtros opcionales (PÚBLICO)
export const getAllTherapistsPublic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { specialty, location, language } = req.query;

    // Construir query dinámicamente
    const query: any = { isActive: true };

    if (specialty) {
      query.specialty = specialty;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' }; // Case-insensitive
    }

    if (language) {
      query.language = { $in: [language] };
    }

    const therapists = await Therapist.find(query)
      .populate('userId', 'firstName lastName email')
      .select('-nationalId') // Ocultar información sensible
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: therapists.length,
      therapists
    });
  } catch (error) {
    console.error('Error al obtener terapeutas:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor al obtener terapeutas' 
    });
  }
};

// Obtener un terapeuta por ID (PÚBLICO)
export const getTherapistByIdPublic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const therapist = await Therapist.findOne({ _id: id, isActive: true })
      .populate('userId', 'firstName lastName email')
      .select('-nationalId');

    if (!therapist) {
      res.status(404).json({ 
        success: false,
        message: 'Terapeuta no encontrado' 
      });
      return;
    }

    res.status(200).json({ 
      success: true,
      therapist 
    });
  } catch (error) {
    console.error('Error al obtener terapeuta:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// ============================================
// RUTAS PROTEGIDAS - SOLO ADMIN
// ============================================

// Crear un nuevo terapeuta (ADMIN)
export const createTherapist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName,
      nationalId,
      specialty,
      location,
      language,
      dateOfBirth,
      profileImage,
      bio
    } = req.body;

    // Verificar que el admin está autenticado
    if (req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado. Solo administradores pueden crear terapeutas.' 
      });
      return;
    }

    // Verificar si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ 
        success: false,
        message: 'Ya existe un usuario con ese email' 
      });
      return;
    }

    // Verificar si ya existe un terapeuta con ese nationalId
    const existingTherapist = await Therapist.findOne({ nationalId });
    if (existingTherapist) {
      res.status(400).json({ 
        success: false,
        message: 'Ya existe un terapeuta con ese ID Nacional' 
      });
      return;
    }

    // 1. Crear el usuario primero
    const newUser = new User({
      email,
      password, // El modelo User debe hashear esto automáticamente
      firstName,
      lastName,
      role: 'therapist'
    });

    await newUser.save();

    // 2. Crear el perfil de terapeuta
    const newTherapist = new Therapist({
      userId: newUser._id,
      nationalId,
      specialty,
      location,
      language: Array.isArray(language) ? language : [language],
      dateOfBirth: new Date(dateOfBirth),
      profileImage,
      bio,
      isActive: true
    });

    await newTherapist.save();

    // Populate para devolver información completa
    await newTherapist.populate('userId', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      message: 'Terapeuta creado exitosamente',
      therapist: newTherapist
    });
  } catch (error: any) {
    console.error('Error al crear terapeuta:', error);
    
    // Si hubo error en la validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ 
        success: false,
        message: 'Error de validación',
        errors 
      });
      return;
    }

    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor al crear terapeuta' 
    });
  }
};

// Obtener todos los terapeutas (ADMIN - incluye inactivos)
export const getAllTherapistsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
      return;
    }

    const therapists = await Therapist.find()
      .populate('userId', 'firstName lastName email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: therapists.length,
      therapists
    });
  } catch (error) {
    console.error('Error al obtener terapeutas (admin):', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// Actualizar terapeuta por ID (ADMIN)
export const updateTherapist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
      return;
    }

    // No permitir actualizar userId ni nationalId por seguridad
    delete updateData.userId;
    delete updateData.nationalId;

    // Si se actualiza el idioma, asegurar que sea array
    if (updateData.language && !Array.isArray(updateData.language)) {
      updateData.language = [updateData.language];
    }

    // Si se actualiza la fecha de nacimiento, convertir a Date
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const updatedTherapist = await Therapist.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email role');

    if (!updatedTherapist) {
      res.status(404).json({ 
        success: false,
        message: 'Terapeuta no encontrado' 
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Terapeuta actualizado exitosamente',
      therapist: updatedTherapist
    });
  } catch (error: any) {
    console.error('Error al actualizar terapeuta:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ 
        success: false,
        message: 'Error de validación',
        errors 
      });
      return;
    }

    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor al actualizar terapeuta' 
    });
  }
};

// Eliminar terapeuta (ADMIN)
export const deleteTherapist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
      return;
    }

    const therapist = await Therapist.findById(id);

    if (!therapist) {
      res.status(404).json({ 
        success: false,
        message: 'Terapeuta no encontrado' 
      });
      return;
    }

    // Soft delete: marcar como inactivo en lugar de eliminar
    therapist.isActive = false;
    await therapist.save();

    // Si quieres hard delete (eliminar permanentemente):
    // await Therapist.findByIdAndDelete(id);
    // await User.findByIdAndDelete(therapist.userId);

    res.status(200).json({
      success: true,
      message: 'Terapeuta desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar terapeuta:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor al eliminar terapeuta' 
    });
  }
};

// Reactivar terapeuta (ADMIN)
export const reactivateTherapist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
      return;
    }

    const therapist = await Therapist.findById(id);

    if (!therapist) {
      res.status(404).json({ 
        success: false,
        message: 'Terapeuta no encontrado' 
      });
      return;
    }

    therapist.isActive = true;
    await therapist.save();

    res.status(200).json({
      success: true,
      message: 'Terapeuta reactivado exitosamente',
      therapist
    });
  } catch (error) {
    console.error('Error al reactivar terapeuta:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// ============================================
// RUTAS PROTEGIDAS - THERAPIST (propias)
// ============================================

// Obtener perfil del terapeuta autenticado
export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const therapist = await Therapist.findOne({ userId: req.user?.userId })
      .populate('userId', 'email firstName lastName');

    if (!therapist) {
      res.status(404).json({ 
        success: false,
        message: 'Perfil de terapeuta no encontrado' 
      });
      return;
    }

    res.status(200).json({ 
      success: true,
      therapist 
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

// Actualizar perfil del terapeuta autenticado
export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { specialty, location, language, dateOfBirth, bio, profileImage } = req.body;

    const therapist = await Therapist.findOne({ userId: req.user?.userId });

    if (!therapist) {
      res.status(404).json({ 
        success: false,
        message: 'Perfil de terapeuta no encontrado' 
      });
      return;
    }

    // Actualizar solo los campos proporcionados
    if (specialty) therapist.specialty = specialty;
    if (location) therapist.location = location;
    if (language) therapist.language = Array.isArray(language) ? language : [language];
    if (dateOfBirth) therapist.dateOfBirth = new Date(dateOfBirth);
    if (bio !== undefined) therapist.bio = bio;
    if (profileImage !== undefined) therapist.profileImage = profileImage;

    await therapist.save();

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      therapist
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};