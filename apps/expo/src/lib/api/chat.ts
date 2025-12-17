import { Chat } from '@src/features/chat';

import { apiClient } from './client';

interface SendMessageResponse {
  messages: Chat[];
}

export const userAPI = {
  sendMessage: async (message: string): Promise<Chat[]> => {
    const response = (await apiClient.post('/chats', {
      message,
    })) as SendMessageResponse;
    return response.messages;
  },
};
