import { apiClient } from './client';

export const ROUTES = {
  CHATS: '/chats',
  QUOTA: '/chats/quota',
} as const;

export interface ChatUserAPI {
  type: 'CHAT';
  sender: 'USER';
  message: string;
  time: string;
}

export interface ChatAssistantAPI {
  type: 'CHAT';
  sender: 'AI';
  message: string;
  time: string;
}

export type ChatAPIMessage = ChatUserAPI | ChatAssistantAPI;
export type ChatAPIResponse = ChatAPIMessage[];

export interface QuotaResponse {
  quota: number;
  timeToRefill: string;
}

export const chatAPI = {
  getChatHistory: async (): Promise<ChatAPIResponse> => {
    const response: { content: ChatAPIResponse } = await apiClient.get(
      ROUTES.CHATS,
    );
    return response.content;
  },
  sendMessage: async (message: string): Promise<ChatAssistantAPI> => {
    const response: ChatAssistantAPI = await apiClient.post(ROUTES.CHATS, {
      message,
    });
    return response;
  },
  getRemainingQuota: async (): Promise<QuotaResponse> => {
    const response: QuotaResponse = await apiClient.get(ROUTES.QUOTA);
    return response;
  },
};
