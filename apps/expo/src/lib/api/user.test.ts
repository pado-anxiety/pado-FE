import { userAPI } from './user';

jest.mock('./client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const { apiClient } = require('./client') as {
  apiClient: { get: jest.Mock; post: jest.Mock };
};

describe('userAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('/users로 GET 요청한다', async () => {
      apiClient.get.mockResolvedValue({ name: '홍길동', email: 'test@test.com' });

      await userAPI.getUser();

      expect(apiClient.get).toHaveBeenCalledWith('/users');
    });

    it('응답 데이터를 반환한다', async () => {
      const mockUser = { name: '홍길동', email: 'test@test.com' };
      apiClient.get.mockResolvedValue(mockUser);

      const result = await userAPI.getUser();

      expect(result).toEqual(mockUser);
    });

    it('에러 시 reject한다', async () => {
      apiClient.get.mockRejectedValue(new Error('Unauthorized'));

      await expect(userAPI.getUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('sendFeedback', () => {
    it('/feedbacks로 feedback과 함께 POST 요청한다', async () => {
      apiClient.post.mockResolvedValue({});

      await userAPI.sendFeedback('앱이 좋아요');

      expect(apiClient.post).toHaveBeenCalledWith('/feedbacks', {
        feedback: '앱이 좋아요',
      });
    });

    it('에러 시 reject한다', async () => {
      apiClient.post.mockRejectedValue(new Error('Server Error'));

      await expect(userAPI.sendFeedback('피드백')).rejects.toThrow('Server Error');
    });
  });
});
