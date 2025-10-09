"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const therapistController_1 = require("../controllers/therapistController");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.get('/public', therapistController_1.getAllTherapistsPublic);
router.get('/public/:id', therapistController_1.getTherapistByIdPublic);
router.get('/profile', auth_1.authenticate, (0, authorize_1.authorize)('therapist'), therapistController_1.getMyProfile);
router.put('/profile', auth_1.authenticate, (0, authorize_1.authorize)('therapist'), therapistController_1.updateMyProfile);
exports.default = router;
//# sourceMappingURL=therapistRoutes.js.map