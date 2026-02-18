import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear carpetas si no existen
const uploadDir = path.join(__dirname, '../../uploads');
const therapistsDir = path.join(uploadDir, 'therapists'); // ✅ NUEVA CARPETA

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(therapistsDir)) {
  fs.mkdirSync(therapistsDir, { recursive: true });
}

// Configuración de almacenamiento PARA BLOG/FORO
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Configuración de almacenamiento PARA TERAPEUTAS
const therapistStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, therapistsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `therapist-${uniqueSuffix}${ext}`);
  }
});

// Filtro de archivos PARA BLOG/FORO (imágenes y videos)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImages = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  const allowedVideos = ['video/mp4', 'video/mpeg', 'video/quicktime'];
  
  if (allowedImages.includes(file.mimetype) || allowedVideos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, GIF) y videos (MP4, MPEG, MOV)'));
  }
};

// Filtro SOLO para imágenes (terapeutas)
const imageOnlyFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)'));
  }
};

// Multer PARA BLOG/FORO (existente)
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB máximo
  },
  fileFilter: fileFilter
});

//Multer PARA TERAPEUTAS (solo imágenes)
export const uploadTherapistImage = multer({
  storage: therapistStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: imageOnlyFilter
});