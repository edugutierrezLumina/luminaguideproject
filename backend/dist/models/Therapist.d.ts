import mongoose, { Document } from 'mongoose';
export declare const CATEGORIES: readonly ["Energy & Spiritual Healing", "Bodywork & Massage", "Holistic & Natural Medicine", "Mental & Emotional Healing", "Movement & Embodiment", "Coaching & Guidance", "Integrative Medical", "Ceremony & Community", "Creative & Expressive Healing", "Specialized Modalities"];
export declare const SPECIALTIES_BY_CATEGORY: Record<string, string[]>;
export declare const ALL_SPECIALTIES: string[];
export declare const SESSION_TYPES: string[];
export declare const FOCUS_AREAS: string[];
export declare const LOCATION_TYPES: string[];
export declare const LANGUAGES: string[];
export declare const DAYS_OF_WEEK: string[];
export declare const TIME_SLOTS: string[];
export interface ITherapist extends Document {
    userId: mongoose.Types.ObjectId;
    nationalId: string;
    specialty: string;
    category?: string;
    additionalSpecialties?: string[];
    location: string;
    locationType?: 'Online' | 'In-person' | 'Hybrid';
    city?: string;
    state?: string;
    country?: string;
    language: string[];
    dateOfBirth: Date;
    profileImage?: string;
    bio?: string;
    credentials?: string;
    yearsExperience?: number;
    certifications?: string[];
    licensedCertified?: boolean;
    sessionTypes?: string[];
    focusAreas?: string[];
    availability?: {
        days?: string[];
        timeSlots?: string[];
        urgentAvailable?: boolean;
        waitlist?: boolean;
    };
    hourlyRate?: number;
    slidingScale?: boolean;
    acceptsInsurance?: boolean;
    freeConsultation?: boolean;
    packagesAvailable?: boolean;
    phone?: string;
    email?: string;
    website?: string;
    isActive: boolean;
    isVerified?: boolean;
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