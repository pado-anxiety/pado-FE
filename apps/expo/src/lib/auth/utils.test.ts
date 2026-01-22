import { authStorage, parseAuthToken } from './utils';

// Mock MMKV storage
const mockStorage = {
  getString: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
};

jest.mock('../store', () => ({
  storage: {
    getString: (key: string) => mockStorage.getString(key),
    set: (key: string, value: string) => mockStorage.set(key, value),
    delete: (key: string) => mockStorage.delete(key),
    remove: (key: string) => mockStorage.remove(key),
  },
}));

describe('authStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('storage에 accessToken이 있으면 반환한다', () => {
      mockStorage.getString.mockReturnValue('test-access-token');

      const result = authStorage.getAccessToken();

      expect(result).toBe('test-access-token');
      expect(mockStorage.getString).toHaveBeenCalledWith('accessToken');
    });

    it('storage에 accessToken이 없으면 null을 반환한다', () => {
      mockStorage.getString.mockReturnValue(undefined);

      const result = authStorage.getAccessToken();

      expect(result).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('storage에 refreshToken이 있으면 반환한다', () => {
      mockStorage.getString.mockReturnValue('test-refresh-token');

      const result = authStorage.getRefreshToken();

      expect(result).toBe('test-refresh-token');
      expect(mockStorage.getString).toHaveBeenCalledWith('refreshToken');
    });

    it('storage에 refreshToken이 없으면 null을 반환한다', () => {
      mockStorage.getString.mockReturnValue(undefined);

      const result = authStorage.getRefreshToken();

      expect(result).toBeNull();
    });
  });

  describe('getName', () => {
    it('storage에 userName이 있으면 반환한다', () => {
      mockStorage.getString.mockReturnValue('홍길동');

      const result = authStorage.getName();

      expect(result).toBe('홍길동');
      expect(mockStorage.getString).toHaveBeenCalledWith('userName');
    });

    it('storage에 userName이 없으면 null을 반환한다', () => {
      mockStorage.getString.mockReturnValue(undefined);

      const result = authStorage.getName();

      expect(result).toBeNull();
    });
  });

  describe('getEmail', () => {
    it('storage에 userEmail이 있으면 반환한다', () => {
      mockStorage.getString.mockReturnValue('test@example.com');

      const result = authStorage.getEmail();

      expect(result).toBe('test@example.com');
      expect(mockStorage.getString).toHaveBeenCalledWith('userEmail');
    });

    it('storage에 userEmail이 없으면 null을 반환한다', () => {
      mockStorage.getString.mockReturnValue(undefined);

      const result = authStorage.getEmail();

      expect(result).toBeNull();
    });
  });

  describe('setAuthToken', () => {
    it('accessToken과 refreshToken을 storage에 저장한다', () => {
      authStorage.setAuthToken('new-access-token', 'new-refresh-token');

      expect(mockStorage.set).toHaveBeenCalledWith(
        'accessToken',
        'new-access-token',
      );
      expect(mockStorage.set).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh-token',
      );
    });

    it('accessToken이 빈 문자열이면 저장하지 않는다', () => {
      authStorage.setAuthToken('', 'new-refresh-token');

      expect(mockStorage.set).not.toHaveBeenCalledWith('accessToken', '');
      expect(mockStorage.set).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh-token',
      );
    });

    it('refreshToken이 빈 문자열이면 저장하지 않는다', () => {
      authStorage.setAuthToken('new-access-token', '');

      expect(mockStorage.set).toHaveBeenCalledWith(
        'accessToken',
        'new-access-token',
      );
      expect(mockStorage.set).not.toHaveBeenCalledWith('refreshToken', '');
    });
  });

  describe('setUserInfo', () => {
    it('name과 email을 storage에 저장한다', () => {
      authStorage.setUserInfo('홍길동', 'test@example.com');

      expect(mockStorage.set).toHaveBeenCalledWith('userName', '홍길동');
      expect(mockStorage.set).toHaveBeenCalledWith(
        'userEmail',
        'test@example.com',
      );
    });

    it('name이 빈 문자열이면 저장하지 않는다', () => {
      authStorage.setUserInfo('', 'test@example.com');

      expect(mockStorage.set).not.toHaveBeenCalledWith('userName', '');
      expect(mockStorage.set).toHaveBeenCalledWith(
        'userEmail',
        'test@example.com',
      );
    });

    it('email이 빈 문자열이면 저장하지 않는다', () => {
      authStorage.setUserInfo('홍길동', '');

      expect(mockStorage.set).toHaveBeenCalledWith('userName', '홍길동');
      expect(mockStorage.set).not.toHaveBeenCalledWith('userEmail', '');
    });
  });

  describe('clearAuthInfo', () => {
    it('accessToken, refreshToken, userName, userEmail을 모두 삭제한다', () => {
      authStorage.clearAuthInfo();

      expect(mockStorage.remove).toHaveBeenCalledWith('accessToken');
      expect(mockStorage.remove).toHaveBeenCalledWith('refreshToken');
      expect(mockStorage.remove).toHaveBeenCalledWith('userName');
      expect(mockStorage.remove).toHaveBeenCalledWith('userEmail');
      expect(mockStorage.remove).toHaveBeenCalledTimes(4);
    });
  });
});

describe('parseAuthToken', () => {
  it('토큰 객체에서 accessToken과 refreshToken을 추출한다', () => {
    const token = {
      accessToken: 'test-access',
      refreshToken: 'test-refresh',
    };

    const result = parseAuthToken(token);

    expect(result).toEqual({
      accessToken: 'test-access',
      refreshToken: 'test-refresh',
    });
  });
});
