"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const forumRoutes_1 = __importDefault(require("./routes/forumRoutes"));
const therapistRoutes_1 = __importDefault(require("./routes/therapistRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
app.use((0, cors_1.default)({
    origin: [
        'https://luminaguide.org',
        'https://www.luminaguide.org',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
(0, database_1.default)();
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Demasiados intentos de inicio de sesión. Intente de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.get('/', (req, res) => {
    res.status(403).json({
        message: 'Acceso denegado. Esta API requiere autenticación.',
        hint: 'Use /auth/login para obtener un token'
    });
});
app.use('/auth/login', loginLimiter);
app.use('/auth', authRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.use('/blog', blogRoutes_1.default);
app.use('/forum', forumRoutes_1.default);
app.use('/therapists', therapistRoutes_1.default);
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Error interno del servidor',
        ...(isProduction ? {} : { stack: err.stack })
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    if (!isProduction) {
        console.log(`📁 Archivos uploads en: ${path_1.default.join(__dirname, '../uploads')}`);
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map