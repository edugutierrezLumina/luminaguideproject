"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forumController_1 = require("../controllers/forumController");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.post('/', forumController_1.createForumPost);
router.get('/approved', forumController_1.getApprovedForumPosts);
router.get('/pending', auth_1.authenticate, (0, authorize_1.authorize)('admin'), forumController_1.getPendingForumPosts);
router.put('/:id/approve', auth_1.authenticate, (0, authorize_1.authorize)('admin'), forumController_1.approveForumPost);
router.delete('/:id', auth_1.authenticate, (0, authorize_1.authorize)('admin'), forumController_1.deleteForumPost);
exports.default = router;
//# sourceMappingURL=forumRoutes.js.map