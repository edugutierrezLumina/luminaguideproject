import api from './api';

export interface Reply {
  _id: string;
  therapistName: string;
  content: string;
  createdAt: string;
}

export interface ForumPost {
  _id?: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail?: string;
  category?: string;
  tags?: string[];
  status: 'pending' | 'approved' | 'rejected';
  replies: Reply[];
  isActive?: boolean;
  createdAt?: string;
}

export const forumService = {
  getApproved: async () => {
    const response = await api.get('/forum/posts'); // ✅ CORREGIDO
    return response.data.posts;
  },

  getPending: async () => {
    const response = await api.get('/forum/admin/posts/pending'); // ✅ CORREGIDO
    return response.data.posts;
  },

  create: async (post: Omit<ForumPost, '_id'>) => {
    const response = await api.post('/forum/posts', post); 
    return response.data;
  },

  moderate: async (id: string, action: 'approve' | 'reject') => {
    const response = await api.put(`/forum/admin/posts/${id}/moderate`, { action }); 
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/forum/admin/posts/${id}`); 
    return response.data;
  },

  addReply: async (postId: string, content: string) => {
    const response = await api.post(`/forum/posts/${postId}/replies`, { content }); 
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/forum/posts/${id}`); 
    return response.data.post;
  }
};