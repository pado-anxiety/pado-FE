import { apiClient } from './client';

interface User {
  name: string;
  email: string;
}

export const userAPI = {
  getUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users');
    return response as User;
  },
  sendFeedback: async (feedback: string) => {
    const response = await apiClient.post('/feedbacks', { feedback });
    return response;
  },
  deleteUser: async () => {
    const response = await apiClient.delete('/users');
    return response;
  },
};
