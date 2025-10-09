import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI as string; 
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📦 Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;