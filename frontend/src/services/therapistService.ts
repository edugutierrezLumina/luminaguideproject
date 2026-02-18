import api from './api';

export interface Therapist {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  nationalId: string;
  
  // Especialidad y categoría
  specialty: string;
  category?: string;
  additionalSpecialties?: string[];
  
  // Ubicación
  location: string;
  locationType?: string;
  city?: string;
  state?: string;
  country?: string;
  
  // Idiomas
  language: string[];
  
  // Información básica
  dateOfBirth: string;
  profileImage?: string;
  bio?: string;
  
  // Credenciales
  credentials?: string;
  yearsExperience?: number;
  certifications?: string[];
  licensedCertified?: boolean;
  
  // Sesiones y enfoque
  sessionTypes?: string[];
  focusAreas?: string[];
  
  // Disponibilidad
  availability?: {
    daysOfWeek?: string[];
    timeSlots?: string[];
    urgentAvailable?: boolean;
    waitlist?: boolean;
  };
  
  // Precios
  hourlyRate?: number;
  slidingScale?: boolean;
  acceptsInsurance?: boolean;
  freeConsultation?: boolean;
  packagesAvailable?: boolean;
  
  // Contacto
  phone?: string;
  website?: string;
  
  // Status
  isActive?: boolean;
  userId?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const therapistService = {
  getAll: async (): Promise<Therapist[]> => {
    const response = await api.get('/therapists/admin/all');
    return response.data.therapists;
  },

  getById: async (id: string): Promise<Therapist> => {
    const response = await api.get(`/therapists/admin/all`);
    const therapist = response.data.therapists.find((t: Therapist) => t._id === id);
    return therapist;
  },

  // ✅ CREAR - Acepta FormData
  create: async (data: FormData) => {
    const response = await api.post('/therapists', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // ✅ ACTUALIZAR - Acepta FormData
  update: async (id: string, data: FormData | Partial<Therapist>) => {
    const headers = data instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : {};
    
    const response = await api.put(`/therapists/${id}`, data, { headers });
    return response.data;
  },

  // Cambiar estado activo/inactivo
  toggleStatus: async (id: string) => {
    const response = await api.patch(`/therapists/${id}/toggle-status`);
    return response.data;
  },

  // elimina PERMANENTEMENTE
  delete: async (id: string) => {
    const response = await api.delete(`/therapists/${id}`);
    return response.data;
  },

  getFilters: async () => {
    const response = await api.get('/therapists/filters');
    return response.data.filters;
  }
};