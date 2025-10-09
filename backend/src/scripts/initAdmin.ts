import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import connectDB from '../config/database';

dotenv.config();

const initAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luminaguide.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'luminal23';

    // Verificar si el admin ya existe
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  El usuario admin ya existe');
      process.exit(0);
    }

    // Crear admin
    const admin = new User({
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Usuario admin creado exitosamente');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear admin:', error);
    process.exit(1);
  }
};

initAdmin();