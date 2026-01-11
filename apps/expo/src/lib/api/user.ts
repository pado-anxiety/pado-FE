import { apiClient } from './client';

export const userAPI = {
  getUser: async () => {
    const response = await apiClient.get('/users');
    return response;
  },
};
