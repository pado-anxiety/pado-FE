import { actAPI, ROUTES } from './act';

jest.mock('./client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const { apiClient } = require('./client') as { apiClient: { post: jest.Mock } };

describe('actAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('anchor', () => {
    it('/records/contact-with-present로 POST 요청한다', async () => {
      apiClient.post.mockResolvedValue(undefined);

      await actAPI.anchor();

      expect(apiClient.post).toHaveBeenCalledWith(ROUTES.ANCHOR);
    });

    it('에러 시 reject한다', async () => {
      const error = new Error('Network Error');
      apiClient.post.mockRejectedValue(error);

      await expect(actAPI.anchor()).rejects.toThrow('Network Error');
    });
  });

  describe('diary', () => {
    it('situation, thoughts, feelings와 함께 POST 요청한다', async () => {
      apiClient.post.mockResolvedValue(undefined);

      await actAPI.diary({
        situation: '회사에서',
        thoughts: '불안하다',
        feelings: '긴장감',
      });

      expect(apiClient.post).toHaveBeenCalledWith(ROUTES.DIARY, {
        situation: '회사에서',
        thoughts: '불안하다',
        feelings: '긴장감',
      });
    });

    it('에러 시 reject한다', async () => {
      apiClient.post.mockRejectedValue(new Error('Server Error'));

      await expect(
        actAPI.diary({ situation: '', thoughts: '', feelings: '' }),
      ).rejects.toThrow('Server Error');
    });
  });

  describe('detach', () => {
    it('userTextToken 배열과 함께 POST 요청한다', async () => {
      apiClient.post.mockResolvedValue(undefined);
      const tokens = [
        { text: '나는', isSelected: false },
        { text: '부족하다', isSelected: true },
      ];

      await actAPI.detach({ userTextToken: tokens });

      expect(apiClient.post).toHaveBeenCalledWith(ROUTES.DETACH, {
        userTextToken: tokens,
      });
    });

    it('에러 시 reject한다', async () => {
      apiClient.post.mockRejectedValue(new Error('Error'));

      await expect(
        actAPI.detach({ userTextToken: [] }),
      ).rejects.toThrow('Error');
    });
  });

  describe('embrace', () => {
    it('breathingTime과 함께 POST 요청한다', async () => {
      apiClient.post.mockResolvedValue(undefined);

      await actAPI.embrace({ breathingTime: 60 });

      expect(apiClient.post).toHaveBeenCalledWith(ROUTES.EMBRACE, {
        breathingTime: 60,
      });
    });

    it('에러 시 reject한다', async () => {
      apiClient.post.mockRejectedValue(new Error('Timeout'));

      await expect(
        actAPI.embrace({ breathingTime: 30 }),
      ).rejects.toThrow('Timeout');
    });
  });

  describe('values', () => {
    it('diagnosis, matter, value, barrier, action과 함께 POST 요청한다', async () => {
      apiClient.post.mockResolvedValue(undefined);
      const params = {
        diagnosis: { work: 8, growth: 7, leisure: 5, relationship: 6 },
        matter: '성장',
        value: '배움',
        barrier: '시간 부족',
        action: '매일 30분 공부',
      };

      await actAPI.values(params);

      expect(apiClient.post).toHaveBeenCalledWith(ROUTES.VALUES, {
        diagnosis: { work: 8, growth: 7, leisure: 5, relationship: 6 },
        matter: '성장',
        value: '배움',
        barrier: '시간 부족',
        action: '매일 30분 공부',
      });
    });

    it('에러 시 reject한다', async () => {
      apiClient.post.mockRejectedValue(new Error('Validation Error'));
      const params = {
        diagnosis: { work: 0, growth: 0, leisure: 0, relationship: 0 },
        matter: '',
        value: '',
        barrier: '',
        action: '',
      };

      await expect(actAPI.values(params)).rejects.toThrow('Validation Error');
    });
  });
});
