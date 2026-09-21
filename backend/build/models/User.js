import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'therapist', 'client'],
        default: 'client'
    },
    firstName: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map