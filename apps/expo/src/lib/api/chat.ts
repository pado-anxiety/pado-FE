import { apiClient } from './client';

export const ROUTES = {
  CHATS: '/chats',
  QUOTA: '/chats/quota',
} as const;

export interface ChatAPIMessage {
  sender: 'USER' | 'AI';
  message: string;
  time: string;
}

export interface ChatHistoryResponse {
  content: ChatAPIMessage[];
  cursor: number | null;
}

export interface QuotaResponse {
  quota: number;
  timeToRefill: string;
}

export const chatAPI = {
  getChatHistory: async (
    cursor?: number | null,
  ): Promise<ChatHistoryResponse> => {
    let url = ROUTES.CHATS;
    if (cursor != null) {
      url += `?cursor=${cursor}`;
    }
    const response: ChatHistoryResponse = await apiClient.get(url);
    return response;
  },
  sendMessage: async (message: string): Promise<ChatAPIMessage> => {
    const response: ChatAPIMessage = await apiClient.post(
      ROUTES.CHATS,
      { message },
      { timeout: 30000 },
    );
    return response;
  },
  getRemainingQuota: async (): Promise<QuotaResponse> => {
    const response: QuotaResponse = await apiClient.get(ROUTES.QUOTA);
    return response;
  },
};
