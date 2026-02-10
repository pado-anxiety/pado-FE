import { apiClient } from './client';

interface User {
  name: string;
  email: string;
}

export const userAPI = {
  postUser: async (timezone: string): Promise<void> => {
    await apiClient.post('/users', { timezone });
  },
  getUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users');
    return response as User;
  },
  sendFeedback: async (feedback: string): Promise<void> => {
    await apiClient.post('/feedbacks', { feedback });
  },
  deleteUser: async () => {
    const response = await apiClient.delete('/users');
    return response;
  },
};
