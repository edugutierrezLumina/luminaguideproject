"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.use((0, authorize_1.authorize)('admin'));
router.post('/therapists', adminController_1.createTherapist);
router.get('/therapists', adminController_1.getAllTherapists);
router.get('/therapists/:id', adminController_1.getTherapistById);
router.put('/therapists/:id', adminController_1.updateTherapist);
router.delete('/therapists/:id', adminController_1.deleteTherapist);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map