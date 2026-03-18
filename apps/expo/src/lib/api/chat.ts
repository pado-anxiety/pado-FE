import { apiClient } from './client';

/** @deprecated Use CHAT_ENDPOINTS instead */
export const ROUTES = {
  CHATS: '/chats',
  QUOTA: '/chats/quota',
  ACT_RECOMMEND: '/act/recommend',
} as const;

const CHAT_ENDPOINTS = {
  CHATS: '/chats',
  QUOTA: '/chats/quota',
  ACT_RECOMMEND: '/act/recommend',
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

export type RecommendACTType =
  | 'CONTACT_WITH_PRESENT'
  | 'EMOTION_NOTE'
  | 'COGNITIVE_DEFUSION'
  | 'ACCEPTANCE'
  | 'COMMITTED_ACTION';

export interface ActRecommendResponse {
  act: RecommendACTType;
  reasons: string[];
}

export const chatAPI = {
  getChatHistory: async (
    cursor?: number | null,
  ): Promise<ChatHistoryResponse> => {
    let url = CHAT_ENDPOINTS.CHATS;
    if (cursor != null) {
      url += `?cursor=${cursor}`;
    }
    const response: ChatHistoryResponse = await apiClient.get(url);
    return response;
  },
  sendMessage: async (message: string): Promise<ChatAPIMessage> => {
    const response: ChatAPIMessage = await apiClient.post(
      CHAT_ENDPOINTS.CHATS,
      { message },
      { timeout: 30000 },
    );
    return response;
  },
  getRemainingQuota: async (): Promise<QuotaResponse> => {
    const response: QuotaResponse = await apiClient.get(CHAT_ENDPOINTS.QUOTA);
    return response;
  },
  getActRecommend: async (): Promise<ActRecommendResponse> => {
    const response: ActRecommendResponse = await apiClient.post(
      CHAT_ENDPOINTS.ACT_RECOMMEND,
      null,
      { timeout: 30000 },
    );
    return response;
  },
};
