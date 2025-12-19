import {
  CBTRecommendationAPI,
  ChatAPI,
  ChatAssistantAPI,
} from '@src/features/chat/types';

import { apiClient } from './client';
import { ROUTES } from './route';

export interface QuotaResponse {
  quota: number;
  timeToRefill: string;
}

export const chatAPI = {
  getChatHistory: async (): Promise<ChatAPI> => {
    const response: { content: ChatAPI } = await apiClient.get(ROUTES.CHATS);
    // console.log('chat history: ', response.content);
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
  getCBTRecommendation: async (): Promise<CBTRecommendationAPI> => {
    const response: CBTRecommendationAPI = await apiClient.post(
      ROUTES.CBT_RECOMMENDATION,
      {
        symptom: 'BODY',
        intensity: 1,
        situation: 'PRESENTATION_EXAM',
      },
    );
    return response;
  },
};
