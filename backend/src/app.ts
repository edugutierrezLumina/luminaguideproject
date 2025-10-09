import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database';

// Importar rutas
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import blogRoutes from './routes/blogRoutes';
import forumRoutes from './routes/forumRoutes';
import therapistRoutes from './routes/therapistRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// 🔧 Logging mejorado
console.log('🔧 Initializing LuminaGuide Backend...');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📍 Port: ${PORT}`);

// CORS - Permitir solo tu dominio principal
app.use(cors({
  origin: [
    'https://luminaguide.org',
    'https://www.luminaguide.org',
    'http://localhost:5173' // Para desarrollo
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conectar a la base de datos
connectDB();

// Rate limiter para prevenir fuerza bruta en login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos máximo
  message: { message: 'Demasiados intentos de inicio de sesión. Intente de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ NUEVO: Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'LuminaGuide Backend API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/auth',
      therapists: '/therapists',
      blog: '/blog',
      forum: '/forum',
      admin: '/admin'
    }
  });
});

// ✅ NUEVO: Health check específico
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rutas públicas (con rate limiting en login)
app.use('/auth/login', loginLimiter);
app.use('/auth', authRoutes);

// Rutas protegidas (requieren autenticación - se valida en cada router)
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);
app.use('/forum', forumRoutes);
app.use('/therapists', therapistRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ═════════════════════════════════════════');
  console.log(`🚀 LuminaGuide Backend Server Started`);
  console.log(`🚀 ═════════════════════════════════════════`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 Therapists: http://localhost:${PORT}/therapists/public`);
  console.log('🚀 ═════════════════════════════════════════');
  console.log('');
  
  if (!isProduction) {
    console.log(`📁 Uploads: ${path.join(__dirname, '../uploads')}`);
  }
});

export default app;