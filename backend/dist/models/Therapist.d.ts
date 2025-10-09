import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ITherapist, {}, {}, {}, mongoose.Document<unknown, {}, ITherapist, {}, {}> & ITherapist & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Therapist.d.ts.map