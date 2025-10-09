import api from './api';

export interface Therapist {
  _id?: string;
  email: string;
  password?: string;
  nationalId: string;
  specialty: string;
  location: string;
  language: string[];
  dateOfBirth: string;
  bio?: string;
  isActive?: boolean;
}

export const therapistService = {
  getAll: async () => {
    const response = await api.get('/admin/therapists');
    return response.data.therapists;
  },

  getById: async (id: string) => {
    const response = await api.get(`/admin/therapists/${id}`);
    return response.data.therapist;
  },

  create: async (therapist: Therapist) => {
    const response = await api.post('/admin/therapists', therapist);
    return response.data;
  },

  update: async (id: string, therapist: Partial<Therapist>) => {
    const response = await api.put(`/admin/therapists/${id}`, therapist);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/admin/therapists/${id}`);
    return response.data;
  },
};