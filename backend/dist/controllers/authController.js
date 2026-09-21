import jwt from 'jsonwebtoken';
import User from '../models/User';
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son requeridos' });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const token = jwt.sign({
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
export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token no proporcionado' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
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
//# sourceMappingURL=authController.js.map