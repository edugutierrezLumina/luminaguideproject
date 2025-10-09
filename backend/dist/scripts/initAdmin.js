"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const database_1 = __importDefault(require("../config/database"));
dotenv_1.default.config();
const initAdmin = async () => {
    try {
        await (0, database_1.default)();
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@luminaguide.org';
        const adminPassword = process.env.ADMIN_PASSWORD || 'luminal23';
        const existingAdmin = await User_1.default.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️  El usuario admin ya existe');
            process.exit(0);
        }
        const admin = new User_1.default({
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });
        await admin.save();
        console.log('✅ Usuario admin creado exitosamente');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error al crear admin:', error);
        process.exit(1);
    }
};
initAdmin();
//# sourceMappingURL=initAdmin.js.map