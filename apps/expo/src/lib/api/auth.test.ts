import axios from 'axios';

import { ROUTES, authAPI } from './auth';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../auth', () => ({
  useAuth: {
    getState: () => ({
      refreshToken: 'mock-refresh-token',
    }),
  },
}));

jest.mock('../env', () => ({
  ENV: {
    BASE_URL: 'https://api.test.com',
  },
}));

describe('authAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ROUTES', () => {
    it('올바른 엔드포인트가 정의되어 있다', () => {
      expect(ROUTES.REFRESH).toBe('/tokens/reissue');
      expect(ROUTES.GOOGLE).toBe('/login/google');
      expect(ROUTES.KAKAO).toBe('/login/kakao');
      expect(ROUTES.LOGOUT).toBe('/logout');
    });
  });

  describe('reissueAuthToken', () => {
    it('정상적인 refreshToken으로 요청 시 새로운 accessToken, refreshToken을 반환한다', async () => {
      const mockResponse = {
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authAPI.reissueAuthToken();

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });

    it('/tokens/reissue 엔드포인트로 POST 요청을 전송한다', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { accessToken: 'token', refreshToken: 'token' },
      });

      await authAPI.reissueAuthToken();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.test.com/tokens/reissue',
        { refreshToken: 'mock-refresh-token' },
      );
    });

    it('유효하지 않은 refreshToken으로 요청 시 에러가 발생한다', async () => {
      const mockError = new Error('Invalid refresh token');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(authAPI.reissueAuthToken()).rejects.toThrow(
        'Invalid refresh token',
      );
    });
  });

  describe('getGoogleAccessToken', () => {
    it('iOS 플랫폼에서 올바른 파라미터로 토큰을 요청한다', async () => {
      const mockResponse = {
        data: {
          accessToken: 'google-access-token',
          refreshToken: 'google-refresh-token',
        },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const params = {
        codeVerifier: 'test-code-verifier',
        authorizationCode: 'test-auth-code',
        redirectUri: 'com.test.app://oauth',
        platform: 'IOS' as const,
      };

      const result = await authAPI.getGoogleAccessToken(params);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.test.com/login/google',
        params,
      );
      expect(result).toEqual({
        accessToken: 'google-access-token',
        refreshToken: 'google-refresh-token',
      });
    });

    it('Android 플랫폼에서 올바른 파라미터로 토큰을 요청한다', async () => {
      const mockResponse = {
        data: {
          accessToken: 'google-access-token',
          refreshToken: 'google-refresh-token',
        },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const params = {
        codeVerifier: '',
        authorizationCode: 'test-server-auth-code',
        redirectUri: '',
        platform: 'ANDROID' as const,
      };

      const result = await authAPI.getGoogleAccessToken(params);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.test.com/login/google',
        params,
      );
      expect(result).toEqual({
        accessToken: 'google-access-token',
        refreshToken: 'google-refresh-token',
      });
    });

    it('/login/google 엔드포인트로 POST 요청을 전송한다', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { accessToken: 'token', refreshToken: 'token' },
      });

      await authAPI.getGoogleAccessToken({
        codeVerifier: 'verifier',
        authorizationCode: 'code',
        redirectUri: 'uri',
        platform: 'IOS',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login/google'),
        expect.any(Object),
      );
    });
  });

  describe('getKaKaoAccessToken', () => {
    it('유효한 accessToken으로 요청 시 토큰을 반환한다', async () => {
      const mockResponse = {
        data: {
          accessToken: 'kakao-access-token',
          refreshToken: 'kakao-refresh-token',
        },
      };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authAPI.getKaKaoAccessToken({
        identityToken: 'kakao-oauth-token',
        refreshToken: 'kakao-refresh-token',
      });

      expect(result).toEqual({
        accessToken: 'kakao-access-token',
        refreshToken: 'kakao-refresh-token',
      });
    });

    it('/login/kakao 엔드포인트로 POST 요청을 전송한다', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { identityToken: 'token', refreshToken: 'token' },
      });

      await authAPI.getKaKaoAccessToken({
        identityToken: 'kakao-oauth-token',
        refreshToken: 'kakao-refresh-token',
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.test.com/login/kakao',
        {
          identityToken: 'kakao-oauth-token',
          refreshToken: 'kakao-refresh-token',
        },
      );
    });
  });

  describe('logout', () => {
    it('accessToken이 있으면 Authorization 헤더와 함께 /logout 엔드포인트로 POST 요청을 전송한다', async () => {
      mockedAxios.post.mockResolvedValue({});

      await authAPI.logout('test-access-token');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.test.com/logout',
        {},
        {
          headers: {
            Authorization: 'Bearer test-access-token',
          },
        },
      );
    });

    it('accessToken이 null이면 API를 호출하지 않는다', async () => {
      await authAPI.logout(null);

      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('accessToken이 빈 문자열이면 API를 호출하지 않는다', async () => {
      // 현재 구현에서는 빈 문자열도 truthy로 처리되므로 호출됨
      // 이 테스트는 현재 동작을 문서화함
      mockedAxios.post.mockResolvedValue({});

      await authAPI.logout('');

      // 빈 문자열은 falsy이므로 호출되지 않음
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });
});
