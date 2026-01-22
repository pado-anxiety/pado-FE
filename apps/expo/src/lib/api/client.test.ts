import MockAdapter from 'axios-mock-adapter';

// Import after mocks are set up
import { apiClient } from './client';

// Mock dependencies before importing client
const mockGetState = jest.fn();
const mockSetAuthToken = jest.fn();
const mockClearAuth = jest.fn();
const mockReissueAuthToken = jest.fn();
const mockShowAlertWarning = jest.fn();
const mockRouterReplace = jest.fn();

jest.mock('../auth', () => ({
  useAuth: {
    getState: () => mockGetState(),
  },
}));

jest.mock('./auth', () => ({
  authAPI: {
    reissueAuthToken: () => mockReissueAuthToken(),
  },
}));

jest.mock('../alert', () => ({
  showAlert: {
    warning: (title: string, message: string, onPress: () => void) =>
      mockShowAlertWarning(title, message, onPress),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    replace: (route: string) => mockRouterReplace(route),
  },
}));

jest.mock('../i18n', () => ({
  i18n: {
    t: (key: string) => key,
  },
}));

jest.mock('../route', () => ({
  ROUTES: {
    LOGIN: '/login',
  },
}));

jest.mock('../env', () => ({
  ENV: {
    BASE_URL: 'https://api.test.com',
  },
}));

describe('apiClient', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios = new MockAdapter(apiClient);

    // Default mock state
    mockGetState.mockReturnValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      setAuthToken: mockSetAuthToken,
      clearAuth: mockClearAuth,
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('Request Interceptor', () => {
    it('accessToken이 있으면 Authorization 헤더에 Bearer 토큰을 설정한다', async () => {
      mockGetState.mockReturnValue({
        accessToken: 'my-access-token',
        refreshToken: 'my-refresh-token',
        setAuthToken: mockSetAuthToken,
        clearAuth: mockClearAuth,
      });

      mockAxios.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBe('Bearer my-access-token');
        return [200, { data: 'success' }];
      });

      await apiClient.get('/test');
    });

    it('accessToken이 없으면 Authorization 헤더를 설정하지 않는다', async () => {
      mockGetState.mockReturnValue({
        accessToken: null,
        refreshToken: null,
        setAuthToken: mockSetAuthToken,
        clearAuth: mockClearAuth,
      });

      mockAxios.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: 'success' }];
      });

      await apiClient.get('/test');
    });
  });

  describe('Response Interceptor - 성공', () => {
    it('정상 응답 시 response.data를 반환한다', async () => {
      mockAxios.onGet('/test').reply(200, { message: 'success', value: 123 });

      const result = await apiClient.get('/test');

      expect(result).toEqual({ message: 'success', value: 123 });
    });
  });

  describe('Response Interceptor - 401 에러 처리', () => {
    it('401 에러 발생 시 authAPI.reissueAuthToken()을 호출한다', async () => {
      mockReissueAuthToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      mockAxios
        .onGet('/test')
        .replyOnce(401)
        .onGet('/test')
        .reply(200, { data: 'success' });

      await apiClient.get('/test');

      expect(mockReissueAuthToken).toHaveBeenCalled();
    });

    it('토큰 재발급 성공 시 useAuth.setAuthToken()으로 새 토큰을 저장한다', async () => {
      mockReissueAuthToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      mockAxios
        .onGet('/test')
        .replyOnce(401)
        .onGet('/test')
        .reply(200, { data: 'success' });

      await apiClient.get('/test');

      expect(mockSetAuthToken).toHaveBeenCalledWith(
        'new-access-token',
        'new-refresh-token',
      );
    });

    it('토큰 재발급 성공 시 원래 요청을 새 토큰으로 재시도한다', async () => {
      mockReissueAuthToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      let requestCount = 0;
      mockAxios.onGet('/test').reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [401, { error: 'Unauthorized' }];
        }
        return [200, { data: 'success after retry' }];
      });

      const result = await apiClient.get('/test');

      expect(requestCount).toBe(2);
      expect(result).toEqual({ data: 'success after retry' });
    });

    it('이미 retry한 요청은 재발급 시도하지 않고 에러를 반환한다', async () => {
      mockReissueAuthToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      // First request returns 401, retry also returns 401
      mockAxios.onGet('/test').reply(401);

      await expect(apiClient.get('/test')).rejects.toThrow();

      // reissueAuthToken should only be called once
      expect(mockReissueAuthToken).toHaveBeenCalledTimes(1);
    });

    it('refreshToken이 없는 상태에서는 재발급 시도하지 않는다', async () => {
      mockGetState.mockReturnValue({
        accessToken: 'test-access-token',
        refreshToken: null, // No refresh token
        setAuthToken: mockSetAuthToken,
        clearAuth: mockClearAuth,
      });

      mockAxios.onGet('/test').reply(401);

      await expect(apiClient.get('/test')).rejects.toThrow();

      expect(mockReissueAuthToken).not.toHaveBeenCalled();
    });
  });

  describe('Response Interceptor - 재발급 실패', () => {
    it('토큰 재발급 실패 시 useAuth.clearAuth()를 호출한다', async () => {
      mockReissueAuthToken.mockRejectedValue(new Error('Reissue failed'));

      mockAxios.onGet('/test').reply(401);

      await expect(apiClient.get('/test')).rejects.toThrow();

      expect(mockClearAuth).toHaveBeenCalled();
    });

    it('showAlert.warning()으로 로그인 필요 알림을 표시한다', async () => {
      mockReissueAuthToken.mockRejectedValue(new Error('Reissue failed'));

      mockAxios.onGet('/test').reply(401);

      await expect(apiClient.get('/test')).rejects.toThrow();

      expect(mockShowAlertWarning).toHaveBeenCalledWith(
        'common.error.loginRequired',
        'common.error.goToLogin',
        expect.any(Function),
      );
    });

    it('알림 확인 시 router.replace(ROUTES.LOGIN)으로 이동한다', async () => {
      mockReissueAuthToken.mockRejectedValue(new Error('Reissue failed'));

      mockAxios.onGet('/test').reply(401);

      await expect(apiClient.get('/test')).rejects.toThrow();

      // Get the callback passed to showAlert.warning
      const callback = mockShowAlertWarning.mock.calls[0][2];
      callback();

      expect(mockRouterReplace).toHaveBeenCalledWith('/login');
    });
  });

  describe('401 이외의 에러', () => {
    it('401이 아닌 에러는 그대로 reject한다', async () => {
      mockAxios.onGet('/test').reply(500, { error: 'Internal Server Error' });

      await expect(apiClient.get('/test')).rejects.toThrow();

      expect(mockReissueAuthToken).not.toHaveBeenCalled();
    });

    it('400 에러는 재발급 시도하지 않는다', async () => {
      mockAxios.onGet('/test').reply(400, { error: 'Bad Request' });

      await expect(apiClient.get('/test')).rejects.toThrow();

      expect(mockReissueAuthToken).not.toHaveBeenCalled();
    });

    it('403 에러는 재발급 시도하지 않는다', async () => {
      mockAxios.onGet('/test').reply(403, { error: 'Forbidden' });

      await expect(apiClient.get('/test')).rejects.toThrow();

      expect(mockReissueAuthToken).not.toHaveBeenCalled();
    });

    it('404 에러는 재발급 시도하지 않는다', async () => {
      mockAxios.onGet('/test').reply(404, { error: 'Not Found' });

      await expect(apiClient.get('/test')).rejects.toThrow();

      expect(mockReissueAuthToken).not.toHaveBeenCalled();
    });
  });
});

describe('apiClient 통합 시나리오', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios = new MockAdapter(apiClient);

    mockGetState.mockReturnValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      setAuthToken: mockSetAuthToken,
      clearAuth: mockClearAuth,
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('토큰 재발급 플로우: API 요청 → 401 에러 → 토큰 재발급 → 원래 요청 재시도', async () => {
    mockReissueAuthToken.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    let callCount = 0;
    mockAxios.onGet('/users/me').reply(() => {
      callCount++;
      if (callCount === 1) {
        return [401, { error: 'Token expired' }];
      }
      return [200, { id: 1, name: '테스트유저' }];
    });

    const result = await apiClient.get('/users/me');

    // 1. 원래 요청 실패 (401)
    // 2. 토큰 재발급
    expect(mockReissueAuthToken).toHaveBeenCalledTimes(1);

    // 3. 새 토큰 저장
    expect(mockSetAuthToken).toHaveBeenCalledWith(
      'new-access-token',
      'new-refresh-token',
    );

    // 4. 원래 요청 재시도 성공
    expect(callCount).toBe(2);
    expect(result).toEqual({ id: 1, name: '테스트유저' });
  });

  it('세션 만료 플로우: API 요청 → 401 에러 → 토큰 재발급 실패 → clearAuth → 알림', async () => {
    mockReissueAuthToken.mockRejectedValue(new Error('Refresh token expired'));

    mockAxios.onGet('/users/me').reply(401);

    await expect(apiClient.get('/users/me')).rejects.toThrow();

    // 1. 토큰 재발급 시도
    expect(mockReissueAuthToken).toHaveBeenCalledTimes(1);

    // 2. clearAuth 호출
    expect(mockClearAuth).toHaveBeenCalled();

    // 3. 알림 표시
    expect(mockShowAlertWarning).toHaveBeenCalled();
  });
});
