import { Chat } from '@src/features/chat';

import { apiClient } from './client';
import { ROUTES } from './route';

interface ChatResponse {
  messages: Chat[];
}

export const userAPI = {
  getChatHistory: async () => {
    const response = (await apiClient.get(ROUTES.CHATS)) as ChatResponse;
    return response.messages;
  },
  sendMessage: async (message: string): Promise<Chat[]> => {
    const response = (await apiClient.post(ROUTES.CHATS, {
      message,
    })) as ChatResponse;
    return response.messages;
  },
};
