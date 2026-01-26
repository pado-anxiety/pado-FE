import { apiClient } from './client';

export interface User {
  name: string;
  email: string;
}

export const userAPI = {
  getUser: async (): Promise<User> => {
    const response: User = await apiClient.get('/users');
    return response;
  },
  sendFeedback: async (feedback: string): Promise<void> => {
    await apiClient.post('/feedbacks', { feedback });
  },
};
