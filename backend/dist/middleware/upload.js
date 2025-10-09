"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
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
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: fileFilter
});
//# sourceMappingURL=upload.js.map