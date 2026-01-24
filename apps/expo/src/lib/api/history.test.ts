import { historyAPI } from './history';

jest.mock('./client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const { apiClient } = require('./client') as { apiClient: { get: jest.Mock } };

describe('historyAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHistory', () => {
    it('cursor 없이 /records 로 요청한다', async () => {
      const mockResponse = {
        cursor: 'abc123',
        hasNext: true,
        content: [
          { id: '1', type: 'EMOTION_NOTE', time: '2025-01-20T10:00:00' },
        ],
      };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await historyAPI.getHistory(null);

      expect(apiClient.get).toHaveBeenCalledWith('/records');
      expect(result).toEqual(mockResponse);
    });

    it('cursor가 있으면 쿼리 파라미터로 전달한다', async () => {
      apiClient.get.mockResolvedValue({ cursor: null, hasNext: false, content: [] });

      await historyAPI.getHistory('cursor123');

      expect(apiClient.get).toHaveBeenCalledWith('/records?cursor=cursor123');
    });

    it('hasNext가 false이면 다음 페이지가 없다', async () => {
      apiClient.get.mockResolvedValue({ cursor: null, hasNext: false, content: [] });

      const result = await historyAPI.getHistory(null);

      expect(result.hasNext).toBe(false);
      expect(result.cursor).toBeNull();
    });
  });

  describe('getDetail', () => {
    it('기록 ID로 상세 내용을 조회한다', async () => {
      const mockDetail = {
        type: 'EMOTION_NOTE',
        data: { situation: '회사', thoughts: '힘들다', feelings: '불안' },
      };
      apiClient.get.mockResolvedValue(mockDetail);

      const result = await historyAPI.getDetail('record-1');

      expect(apiClient.get).toHaveBeenCalledWith('/records/record-1');
      expect(result).toEqual(mockDetail);
    });
  });
});
