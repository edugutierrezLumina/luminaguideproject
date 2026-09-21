import User from '../models/User';
import Therapist from '../models/Therapist';
export const createTherapist = async (req, res) => {
    try {
        console.log('========================================');
        console.log('📥 DATOS RECIBIDOS EN BACKEND:');
        console.log(JSON.stringify(req.body, null, 2));
        console.log('========================================');
        const { email, password, nationalId, specialty, location, language, dateOfBirth, bio, profileImage } = req.body;
        if (!email || !password || !nationalId || !specialty || !location || !language || !dateOfBirth) {
            console.error('❌ FALTAN CAMPOS REQUERIDOS');
            res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos',
                missing: {
                    email: !email,
                    password: !password,
                    nationalId: !nationalId,
                    specialty: !specialty,
                    location: !location,
                    language: !language,
                    dateOfBirth: !dateOfBirth
                }
            });
            return;
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error('❌ Email ya existe:', email);
            res.status(400).json({ success: false, message: 'El email ya está registrado' });
            return;
        }
        const existingTherapist = await Therapist.findOne({ nationalId });
        if (existingTherapist) {
            console.error('❌ National ID ya existe:', nationalId);
            res.status(400).json({ success: false, message: 'El ID nacional ya está registrado' });
            return;
        }
        console.log('✅ Creando usuario...');
        const user = new User({
            email,
            password,
            firstName: 'Therapist',
            lastName: nationalId,
            role: 'therapist'
        });
        await user.save();
        console.log('✅ Usuario creado:', user._id);
        console.log('✅ Creando perfil de terapeuta...');
        const therapist = new Therapist({
            userId: user._id,
            nationalId,
            specialty,
            location,
            language: Array.isArray(language) ? language : [language],
            dateOfBirth: new Date(dateOfBirth),
            profileImage: profileImage || null,
            bio: bio || ''
        });
        await therapist.save();
        console.log('✅ Terapeuta creado:', therapist._id);
        res.status(201).json({
            success: true,
            message: 'Terapeuta creado exitosamente',
            therapist: {
                id: therapist._id,
                email: user.email,
                nationalId: therapist.nationalId,
                specialty: therapist.specialty,
                location: therapist.location,
                language: therapist.language,
                dateOfBirth: therapist.dateOfBirth
            }
        });
    }
    catch (error) {
        console.error('========================================');
        console.error('❌ ERROR AL CREAR TERAPEUTA:');
        console.error('Message:', error.message);
        console.error('Name:', error.name);
        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        console.error('Stack:', error.stack);
        console.error('========================================');
        res.status(500).json({
            success: false,
            message: error.message || 'Error en el servidor',
            errors: error.errors || null
        });
    }
};
export const getAllTherapists = async (req, res) => {
    try {
        const therapists = await Therapist.find()
            .populate('userId', 'email firstName lastName')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            therapists
        });
    }
    catch (error) {
        console.error('Error al obtener terapeutas:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};
export const getTherapistById = async (req, res) => {
    try {
        const { id } = req.params;
        const therapist = await Therapist.findById(id)
            .populate('userId', 'email firstName lastName');
        if (!therapist) {
            res.status(404).json({ success: false, message: 'Terapeuta no encontrado' });
            return;
        }
        res.status(200).json({ success: true, therapist });
    }
    catch (error) {
        console.error('Error al obtener terapeuta:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};
export const updateTherapist = async (req, res) => {
    try {
        const { id } = req.params;
        const { nationalId, specialty, location, language, dateOfBirth, bio, isActive, profileImage } = req.body;
        const therapist = await Therapist.findById(id);
        if (!therapist) {
            res.status(404).json({ success: false, message: 'Terapeuta no encontrado' });
            return;
        }
        if (nationalId)
            therapist.nationalId = nationalId;
        if (specialty)
            therapist.specialty = specialty;
        if (location)
            therapist.location = location;
        if (language)
            therapist.language = Array.isArray(language) ? language : [language];
        if (dateOfBirth)
            therapist.dateOfBirth = new Date(dateOfBirth);
        if (bio !== undefined)
            therapist.bio = bio;
        if (isActive !== undefined)
            therapist.isActive = isActive;
        if (profileImage !== undefined)
            therapist.profileImage = profileImage;
        await therapist.save();
        res.status(200).json({
            success: true,
            message: 'Terapeuta actualizado exitosamente',
            therapist
        });
    }
    catch (error) {
        console.error('Error al actualizar terapeuta:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};
export const deleteTherapist = async (req, res) => {
    try {
        const { id } = req.params;
        const therapist = await Therapist.findById(id);
        if (!therapist) {
            res.status(404).json({ success: false, message: 'Terapeuta no encontrado' });
            return;
        }
        await User.findByIdAndDelete(therapist.userId);
        await Therapist.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Terapeuta eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al eliminar terapeuta:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};
//# sourceMappingURL=adminController.js.map