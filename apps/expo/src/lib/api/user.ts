import { apiClient } from './client';

export const userAPI = {
  getUser: async () => {
    const response = await apiClient.get('/users');
    return response;
  },
  sendFeedback: async (feedback: string) => {
    const response = await apiClient.post('/feedbacks', { feedback });
    return response;
  },
};
