import api from './api';

export interface ForumPost {
  _id?: string;
  content: string;
  authorName: string;
  isApproved: boolean;
  createdAt?: string;
}

export const forumService = {
  getPending: async () => {
    const response = await api.get('/forum/pending');
    return response.data.forumPosts;
  },

  getApproved: async () => {
    const response = await api.get('/forum/approved');
    return response.data.forumPosts;
  },

  create: async (post: Omit<ForumPost, '_id'>) => {
    const response = await api.post('/forum', post);
    return response.data;
  },

  approve: async (id: string) => {
    const response = await api.put(`/forum/${id}/approve`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/forum/${id}`);
    return response.data;
  },
};