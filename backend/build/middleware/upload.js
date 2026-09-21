import multer from 'multer';
import path from 'path';
import fs from 'fs';
const uploadDir = path.join(__dirname, '../../uploads');
const therapistsDir = path.join(uploadDir, 'therapists');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(therapistsDir)) {
    fs.mkdirSync(therapistsDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
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
const fileFilter = (req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const allowedVideos = ['video/mp4', 'video/mpeg', 'video/quicktime'];
    if (allowedImages.includes(file.mimetype) || allowedVideos.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, GIF) y videos (MP4, MPEG, MOV)'));
    }
};
const imageOnlyFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)'));
    }
};
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: fileFilter
});
export const uploadTherapistImage = multer({
    storage: therapistStorage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: imageOnlyFilter
});
//# sourceMappingURL=upload.js.map