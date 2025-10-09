import mongoose, { Document, Schema } from 'mongoose';

export interface ITherapist extends Document {
  userId: mongoose.Types.ObjectId;
  nationalId: string;
  specialty: string;
  location: string;
  language: string[];
  dateOfBirth: Date;
  profileImage?: string;
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

if (mongoose.models.Therapist) {
  delete mongoose.models.Therapist;
  delete mongoose.connection.collections['therapists'];
}

const TherapistSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nationalId: {
    type: String,
    required: [true, 'El ID Nacional es requerido'],
    unique: true,
    trim: true
  },
  specialty: {
    type: String,
    required: [true, 'La especialidad es requerida'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'La ubicación es requerida'],
    trim: true
  },
  language: {
    type: [String],
    required: [true, 'Al menos un idioma es requerido'],
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'Debe especificar al menos un idioma'
    }
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'La fecha de nacimiento es requerida']
  },
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas rápidas
TherapistSchema.index({ specialty: 1, location: 1, isActive: 1 });
TherapistSchema.index({ userId: 1 });

export default mongoose.model<ITherapist>('Therapist', TherapistSchema);