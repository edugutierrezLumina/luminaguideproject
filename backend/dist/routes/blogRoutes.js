"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.get('/published', blogController_1.getPublishedBlogPosts);
router.post('/', auth_1.authenticate, (0, authorize_1.authorize)('admin'), upload_1.upload.array('files', 10), blogController_1.createBlogPost);
router.get('/', auth_1.authenticate, (0, authorize_1.authorize)('admin'), blogController_1.getAllBlogPosts);
router.put('/:id', auth_1.authenticate, (0, authorize_1.authorize)('admin'), blogController_1.updateBlogPost);
router.delete('/:id', auth_1.authenticate, (0, authorize_1.authorize)('admin'), blogController_1.deleteBlogPost);
exports.default = router;
//# sourceMappingURL=blogRoutes.js.map