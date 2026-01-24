import { chatAPI, ROUTES } from './chat';

jest.mock('./client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('@src/features/chat/types', () => ({}));

const { apiClient } = require('./client') as {
  apiClient: { get: jest.Mock; post: jest.Mock };
};

describe('chatAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getChatHistory', () => {
    it('/chats로 GET 요청하고 response.content를 반환한다', async () => {
      const mockHistory = [{ role: 'user', message: '안녕' }];
      apiClient.get.mockResolvedValue({ content: mockHistory });

      const result = await chatAPI.getChatHistory();

      expect(apiClient.get).toHaveBeenCalledWith(ROUTES.CHATS);
      expect(result).toEqual(mockHistory);
    });

    it('에러 시 reject한다', async () => {
      apiClient.get.mockRejectedValue(new Error('Network Error'));

      await expect(chatAPI.getChatHistory()).rejects.toThrow('Network Error');
    });
  });

  describe('sendMessage', () => {
    it('/chats로 message와 함께 POST 요청한다', async () => {
      const mockResponse = { role: 'assistant', message: '반갑습니다' };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await chatAPI.sendMessage('안녕하세요');

      expect(apiClient.post).toHaveBeenCalledWith(ROUTES.CHATS, {
        message: '안녕하세요',
      });
      expect(result).toEqual(mockResponse);
    });

    it('에러 시 reject한다', async () => {
      apiClient.post.mockRejectedValue(new Error('Error'));

      await expect(chatAPI.sendMessage('메시지')).rejects.toThrow('Error');
    });
  });

  describe('getRemainingQuota', () => {
    it('/chats/quota로 GET 요청한다', async () => {
      const mockQuota = { quota: 5, timeToRefill: '2025-01-20T10:00:00' };
      apiClient.get.mockResolvedValue(mockQuota);

      const result = await chatAPI.getRemainingQuota();

      expect(apiClient.get).toHaveBeenCalledWith(ROUTES.QUOTA);
      expect(result).toEqual(mockQuota);
    });

    it('에러 시 reject한다', async () => {
      apiClient.get.mockRejectedValue(new Error('Error'));

      await expect(chatAPI.getRemainingQuota()).rejects.toThrow('Error');
    });
  });

  describe('getCBTRecommendation', () => {
    it('/cbt/recommend로 올바른 body와 함께 POST 요청한다', async () => {
      const mockRecommendation = { actType: 'ANCHOR', reason: '추천 이유' };
      apiClient.post.mockResolvedValue(mockRecommendation);

      const params = {
        symptom: 'ANXIETY' as any,
        intensity: 'HIGH' as any,
        trigger: 'WORK' as any,
      };

      const result = await chatAPI.getCBTRecommendation(params);

      expect(apiClient.post).toHaveBeenCalledWith(ROUTES.CBT_RECOMMENDATION, {
        symptom: 'ANXIETY',
        intensity: 'HIGH',
        situation: 'WORK',
      });
      expect(result).toEqual(mockRecommendation);
    });

    it('에러 시 reject한다', async () => {
      apiClient.post.mockRejectedValue(new Error('Error'));

      await expect(
        chatAPI.getCBTRecommendation({
          symptom: 'DEPRESSION' as any,
          intensity: 'LOW' as any,
          trigger: 'RELATIONSHIP' as any,
        }),
      ).rejects.toThrow('Error');
    });
  });
});
