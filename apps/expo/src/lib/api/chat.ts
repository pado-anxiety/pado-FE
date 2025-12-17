import { Chat } from '@src/features/chat';

import { apiClient } from './client';
import { ROUTES } from './route';

interface SendMessageResponse {
  messages: Chat[];
}

export const userAPI = {
  sendMessage: async (message: string): Promise<Chat[]> => {
    const response = (await apiClient.post(ROUTES.CHATS, {
      message,
    })) as SendMessageResponse;
    return response.messages;
  },
};
