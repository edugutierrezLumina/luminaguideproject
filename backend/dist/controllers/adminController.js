"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTherapist = exports.updateTherapist = exports.getTherapistById = exports.getAllTherapists = exports.createTherapist = void 0;
const User_1 = __importDefault(require("../models/User"));
const Therapist_1 = __importDefault(require("../models/Therapist"));
const createTherapist = async (req, res) => {
    try {
        const { email, password, nationalId, specialty, location, language, dateOfBirth, bio } = req.body;
        if (!email || !password || !nationalId || !specialty || !location || !language || !dateOfBirth) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'El email ya está registrado' });
            return;
        }
        const existingTherapist = await Therapist_1.default.findOne({ nationalId });
        if (existingTherapist) {
            res.status(400).json({ message: 'El ID nacional ya está registrado' });
            return;
        }
        const user = new User_1.default({
            email,
            password,
            role: 'therapist'
        });
        await user.save();
        const therapist = new Therapist_1.default({
            userId: user._id,
            nationalId,
            specialty,
            location,
            language: Array.isArray(language) ? language : [language],
            dateOfBirth: new Date(dateOfBirth),
            bio: bio || ''
        });
        await therapist.save();
        res.status(201).json({
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
        console.error('Error al crear terapeuta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.createTherapist = createTherapist;
const getAllTherapists = async (req, res) => {
    try {
        const therapists = await Therapist_1.default.find()
            .populate('userId', 'email')
            .sort({ createdAt: -1 });
        res.status(200).json({ therapists });
    }
    catch (error) {
        console.error('Error al obtener terapeutas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.getAllTherapists = getAllTherapists;
const getTherapistById = async (req, res) => {
    try {
        const { id } = req.params;
        const therapist = await Therapist_1.default.findById(id).populate('userId', 'email');
        if (!therapist) {
            res.status(404).json({ message: 'Terapeuta no encontrado' });
            return;
        }
        res.status(200).json({ therapist });
    }
    catch (error) {
        console.error('Error al obtener terapeuta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.getTherapistById = getTherapistById;
const updateTherapist = async (req, res) => {
    try {
        const { id } = req.params;
        const { nationalId, specialty, location, language, dateOfBirth, bio, isActive } = req.body;
        const therapist = await Therapist_1.default.findById(id);
        if (!therapist) {
            res.status(404).json({ message: 'Terapeuta no encontrado' });
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
        await therapist.save();
        res.status(200).json({
            message: 'Therapist successfully updated',
            therapist
        });
    }
    catch (error) {
        console.error('Error at updating therapist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateTherapist = updateTherapist;
const deleteTherapist = async (req, res) => {
    try {
        const { id } = req.params;
        const therapist = await Therapist_1.default.findById(id);
        if (!therapist) {
            res.status(404).json({ message: 'Therapist not found' });
            return;
        }
        await User_1.default.findByIdAndDelete(therapist.userId);
        await Therapist_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Therapist deleted successfully' });
    }
    catch (error) {
        console.error('Error at deleting therapist:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteTherapist = deleteTherapist;
//# sourceMappingURL=adminController.js.map