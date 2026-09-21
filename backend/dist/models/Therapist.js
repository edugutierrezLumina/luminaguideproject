import mongoose, { Schema } from 'mongoose';
export const CATEGORIES = [
    'Energy & Spiritual Healing',
    'Bodywork & Massage',
    'Holistic & Natural Medicine',
    'Mental & Emotional Healing',
    'Movement & Embodiment',
    'Coaching & Guidance',
    'Integrative Medical',
    'Ceremony & Community',
    'Creative & Expressive Healing',
    'Specialized Modalities'
];
export const SPECIALTIES_BY_CATEGORY = {
    'Energy & Spiritual Healing': [
        'Reiki', 'Shamanic Healing', 'Crystal Healing', 'Energy Work', 'Chakra Balancing'
    ],
    'Bodywork & Massage': [
        'Deep Tissue Massage', 'Thai Massage', 'Reflexology', 'Craniosacral Therapy', 'Myofascial Release'
    ],
    'Holistic & Natural Medicine': [
        'Naturopathic Doctor', 'Herbalist', 'Ayurveda', 'Traditional Chinese Medicine', 'Homeopathy'
    ],
    'Mental & Emotional Healing': [
        'EMDR', 'Somatic Therapy', 'Hypnotherapy', 'Cognitive Behavioral Therapy', 'Trauma Therapy'
    ],
    'Movement & Embodiment': [
        'Yoga', 'Dance Therapy', 'Personal Trainer', 'Pilates', 'Qigong'
    ],
    'Coaching & Guidance': [
        'Life Coach', 'Soul Guide', 'Career Coach', 'Spiritual Mentor', 'Wellness Coach'
    ],
    'Integrative Medical': [
        'Integrative MD', 'Chiropractor', 'Acupuncturist', 'Physical Therapist', 'Osteopath'
    ],
    'Ceremony & Community': [
        'Cacao Ceremony', 'Sound Bath', 'Meditation', 'Breathwork Circle', 'Women\'s Circle'
    ],
    'Creative & Expressive Healing': [
        'Art Therapy', 'Music Therapy', 'Writing Therapy', 'Drama Therapy', 'Poetry Therapy'
    ],
    'Specialized Modalities': [
        'Doula', 'Fertility Healing', 'Ancestral Healing', 'Past Life Regression', 'Medical Intuitive'
    ]
};
export const ALL_SPECIALTIES = Object.values(SPECIALTIES_BY_CATEGORY).flat();
export const SESSION_TYPES = [
    'Individual',
    'Group',
    'Couples',
    'Family',
    'Retreats',
    'Circles'
];
export const FOCUS_AREAS = [
    'Women',
    'Men',
    'LGBTQ+',
    'Children',
    'Families',
    'Trauma-Informed',
    'Neurodivergent-Friendly',
    'Cultural Healing',
    'Ancestral Healing'
];
export const LOCATION_TYPES = ['Online', 'In-person', 'Hybrid'];
export const LANGUAGES = [
    'English',
    'Spanish',
    'Bilingual',
    'Portuguese',
    'French',
    'German',
    'Mandarin',
    'Other'
];
export const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];
export const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];
const TherapistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    nationalId: {
        type: String,
        required: [true, 'El ID Nacional es requerido'],
        unique: true,
        trim: true,
        index: true
    },
    specialty: {
        type: String,
        required: [true, 'La especialidad es requerida'],
        trim: true,
        index: true
    },
    location: {
        type: String,
        required: [true, 'La ubicación es requerida'],
        trim: true,
        index: true
    },
    language: {
        type: [String],
        required: [true, 'Al menos un idioma es requerido'],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Debe especificar al menos un idioma'
        },
        index: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'La fecha de nacimiento es requerida']
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    category: {
        type: String,
        enum: [...CATEGORIES, 'Other', null],
        default: null,
        trim: true,
        index: true
    },
    additionalSpecialties: {
        type: [String],
        default: []
    },
    locationType: {
        type: String,
        enum: [...LOCATION_TYPES, null],
        default: null,
        index: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        default: 'United States',
        trim: true
    },
    profileImage: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 1000
    },
    credentials: {
        type: String,
        trim: true
    },
    yearsExperience: {
        type: Number,
        min: 0
    },
    certifications: {
        type: [String],
        default: []
    },
    licensedCertified: {
        type: Boolean,
        default: false
    },
    sessionTypes: {
        type: [String],
        default: []
    },
    focusAreas: {
        type: [String],
        default: []
    },
    availability: {
        days: {
            type: [String],
            enum: DAYS_OF_WEEK,
            default: []
        },
        timeSlots: {
            type: [String],
            enum: TIME_SLOTS,
            default: []
        },
        urgentAvailable: {
            type: Boolean,
            default: false
        },
        waitlist: {
            type: Boolean,
            default: false
        }
    },
    hourlyRate: {
        type: Number,
        min: 0
    },
    slidingScale: {
        type: Boolean,
        default: false
    },
    acceptsInsurance: {
        type: Boolean,
        default: false
    },
    freeConsultation: {
        type: Boolean,
        default: false
    },
    packagesAvailable: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    website: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
TherapistSchema.index({ specialty: 1, location: 1, isActive: 1 });
TherapistSchema.index({ category: 1, specialty: 1 });
TherapistSchema.index({ isActive: 1, isVerified: 1 });
TherapistSchema.index({ locationType: 1, isActive: 1 });
export default mongoose.model('Therapist', TherapistSchema);
//# sourceMappingURL=Therapist.js.map