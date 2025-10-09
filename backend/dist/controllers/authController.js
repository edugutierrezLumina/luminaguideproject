"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son requeridos' });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.login = login;
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token no proporcionado' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=authController.js.map