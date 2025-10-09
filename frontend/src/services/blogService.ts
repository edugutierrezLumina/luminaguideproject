import api from './api';

export interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  images?: string[];
  videos?: string[];
  isPublished: boolean;
  author?: {
    _id: string;
    email: string;
  };
  createdAt?: string;
}

export const blogService = {
  getAll: async () => {
    const response = await api.get('/blog');
    return response.data.blogPosts;
  },

  getPublished: async () => {
    const response = await api.get('/blog/published');
    return response.data.blogPosts;
  },

  create: async (formData: FormData) => {
    const response = await api.post('/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, post: Partial<BlogPost>) => {
    const response = await api.put(`/blog/${id}`, post);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },
};