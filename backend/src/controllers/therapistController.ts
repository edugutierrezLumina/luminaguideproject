import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Therapist, { 
  CATEGORIES, 
  SPECIALTIES_BY_CATEGORY, 
  ALL_SPECIALTIES,
  SESSION_TYPES,
  FOCUS_AREAS
} from '../models/Therapist';
import User from '../models/User';

// ============================================
// Obtener filtros disponibles
// ============================================
export const getAvailableFilters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customSpecialties = await Therapist.distinct('specialty');
    const customCategories = await Therapist.distinct('category');
    
    const allSpecialties = [...new Set([...ALL_SPECIALTIES, ...customSpecialties])].sort();
    const allCategories = [...new Set([...CATEGORIES, ...customCategories.filter(c => c)])].sort();
    
    res.status(200).json({
      success: true,
      filters: {
        categories: allCategories,
        specialtiesByCategory: SPECIALTIES_BY_CATEGORY,
        allSpecialties,
        locations: await Therapist.distinct('location'),
        languages: await Therapist.distinct('language').then(langs => langs.flat()),
        locationTypes: ['Online', 'In-person', 'Hybrid'],
        sessionTypes: SESSION_TYPES,
        focusAreas: FOCUS_AREAS
      }
    });
  } catch (error) {
    console.error('Error getting filters:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener filtros'
    });
  }
};

// ============================================
// RUTAS PÚBLICAS
// ============================================

export const getAllTherapistsPublic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      specialty,
      category,
      location,
      locationType,
      language,
      sessionType,
      focusArea,
      slidingScale,
      acceptsInsurance,
      freeConsultation,
      minExperience,
      licensed
    } = req.query;

    const query: any = { isActive: true };

    if (category) query.category = category;
    if (specialty) query.specialty = specialty;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (locationType) query.locationType = locationType;
    if (language) query.language = { $in: [language] };
    if (sessionType) query.sessionTypes = { $in: [sessionType] };
    if (focusArea) query.focusAreas = { $in: [focusArea] };
    if (slidingScale === 'true') query.slidingScale = true;
    if (acceptsInsurance === 'true') query.acceptsInsurance = true;
    if (freeConsultation === 'true') query.freeConsultation = true;
    if (minExperience) query.yearsExperience = { $gte: parseInt(minExperience as string) };
    if (licensed === 'true') query.licensedCertified = true;

    const therapists = await Therapist.find(query)
      .populate('userId', 'firstName lastName email')
      .select('-nationalId')
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
// RUTAS PROTEGIDAS - ADMIN
// ============================================

export const createTherapist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      email, 
      password, 
      firstName,
      lastName,
      nationalId,
      specialty,
      category,
      additionalSpecialties,
      location,
      locationType,
      city,
      state,
      country,
      language,
      dateOfBirth,
      bio,
      credentials,
      yearsExperience,
      certifications,
      licensedCertified,
      sessionTypes,
      focusAreas,
      hourlyRate,
      slidingScale,
      acceptsInsurance,
      freeConsultation,
      phone,
      website
    } = req.body;

    // ✅ CAPTURAR IMAGEN SUBIDA
    const profileImage = req.file ? `/uploads/therapists/${req.file.filename}` : undefined;

    if (req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado. Solo administradores pueden crear terapeutas.' 
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ 
        success: false,
        message: 'Ya existe un usuario con ese email' 
      });
      return;
    }

    const existingTherapist = await Therapist.findOne({ nationalId });
    if (existingTherapist) {
      res.status(400).json({ 
        success: false,
        message: 'Ya existe un terapeuta con ese ID Nacional' 
      });
      return;
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: 'therapist'
    });

    await newUser.save();

    const newTherapist = new Therapist({
      userId: newUser._id,
      nationalId,
      specialty,
      category: category || null,
      additionalSpecialties: additionalSpecialties || [],
      location,
      locationType: locationType || null,
      city,
      state,
      country: country || 'United States',
      language: Array.isArray(language) ? language : [language],
      dateOfBirth: new Date(dateOfBirth),
      profileImage, // ✅ GUARDAR IMAGEN
      bio,
      credentials,
      yearsExperience: yearsExperience || undefined,
      certifications: certifications || [],
      licensedCertified: licensedCertified || false,
      sessionTypes: sessionTypes || [],
      focusAreas: focusAreas || [],
      hourlyRate: hourlyRate || undefined,
      slidingScale: slidingScale || false,
      acceptsInsurance: acceptsInsurance || false,
      freeConsultation: freeConsultation || false,
      phone,
      email,
      website,
      isActive: true,
      isVerified: false
    });

    await newTherapist.save();
    await newTherapist.populate('userId', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      message: 'Terapeuta creado exitosamente',
      therapist: newTherapist
    });
  } catch (error: any) {
    console.error('Error al crear terapeuta:', error);
    
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

export const updateTherapist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ✅ CAPTURAR IMAGEN SUBIDA
    if (req.file) {
      updateData.profileImage = `/uploads/therapists/${req.file.filename}`;
    }

    if (req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
      return;
    }

    delete updateData.userId;
    delete updateData.nationalId;

    if (updateData.language && !Array.isArray(updateData.language)) {
      updateData.language = [updateData.language];
    }

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

    therapist.isActive = false;
    await therapist.save();

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

export const toggleTherapistStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: 'Acceso denegado' 
      });
      return;
    }

    const therapist = await Therapist.findById(id)
      .populate('userId', 'firstName lastName email role');

    if (!therapist) {
      res.status(404).json({ 
        success: false,
        message: 'Terapeuta no encontrado' 
      });
      return;
    }

    therapist.isActive = !therapist.isActive;
    await therapist.save();

    res.status(200).json({
      success: true,
      message: `Terapeuta ${therapist.isActive ? 'activado' : 'desactivado'} exitosamente`,
      therapist
    });
  } catch (error) {
    console.error('Error al cambiar estado del terapeuta:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor' 
    });
  }
};

export const hardDeleteTherapist = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const userId = therapist.userId;

    await Therapist.findByIdAndDelete(id);
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Terapeuta eliminado PERMANENTEMENTE de la base de datos'
    });
  } catch (error) {
    console.error('Error al eliminar terapeuta permanentemente:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor al eliminar terapeuta' 
    });
  }
};

// ============================================
// RUTAS PROTEGIDAS - THERAPIST
// ============================================

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

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updateData = req.body;

    // ✅ CAPTURAR IMAGEN SUBIDA
    if (req.file) {
      updateData.profileImage = `/uploads/therapists/${req.file.filename}`;
    }

    const therapist = await Therapist.findOne({ userId: req.user?.userId });

    if (!therapist) {
      res.status(404).json({ 
        success: false,
        message: 'Perfil de terapeuta no encontrado' 
      });
      return;
    }

    const allowedFields = [
      'specialty', 'category', 'additionalSpecialties',
      'location', 'locationType', 'city', 'state',
      'language', 'dateOfBirth', 'bio', 'profileImage',
      'credentials', 'yearsExperience', 'certifications', 'licensedCertified',
      'sessionTypes', 'focusAreas',
      'hourlyRate', 'slidingScale', 'acceptsInsurance', 'freeConsultation',
      'phone', 'email', 'website'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'language' && !Array.isArray(updateData[field])) {
          (therapist as any)[field] = [updateData[field]];
        } else if (field === 'dateOfBirth') {
          (therapist as any)[field] = new Date(updateData[field]);
        } else {
          (therapist as any)[field] = updateData[field];
        }
      }
    });

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