"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTherapistByIdPublic = exports.getAllTherapistsPublic = exports.updateMyProfile = exports.getMyProfile = void 0;
const Therapist_1 = __importDefault(require("../models/Therapist"));
const getMyProfile = async (req, res) => {
    try {
        const therapist = await Therapist_1.default.findOne({ userId: req.user?.userId })
            .populate('userId', 'email');
        if (!therapist) {
            res.status(404).json({ message: 'Perfil de terapeuta no encontrado' });
            return;
        }
        res.status(200).json({ therapist });
    }
    catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.getMyProfile = getMyProfile;
const updateMyProfile = async (req, res) => {
    try {
        const { specialty, location, language, dateOfBirth, bio } = req.body;
        const therapist = await Therapist_1.default.findOne({ userId: req.user?.userId });
        if (!therapist) {
            res.status(404).json({ message: 'Perfil de terapeuta no encontrado' });
            return;
        }
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
        await therapist.save();
        res.status(200).json({
            message: 'Perfil actualizado exitosamente',
            therapist
        });
    }
    catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.updateMyProfile = updateMyProfile;
const getAllTherapistsPublic = async (req, res) => {
    try {
        const therapists = await Therapist_1.default.find({ isActive: true })
            .populate('userId', 'email')
            .select('-nationalId')
            .sort({ createdAt: -1 });
        res.status(200).json({ therapists });
    }
    catch (error) {
        console.error('Error al obtener terapeutas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.getAllTherapistsPublic = getAllTherapistsPublic;
const getTherapistByIdPublic = async (req, res) => {
    try {
        const { id } = req.params;
        const therapist = await Therapist_1.default.findOne({ _id: id, isActive: true })
            .populate('userId', 'email')
            .select('-nationalId');
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
exports.getTherapistByIdPublic = getTherapistByIdPublic;
//# sourceMappingURL=therapistController.js.map