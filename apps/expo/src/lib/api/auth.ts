import { getRefreshToken } from '../auth';
import { apiClient } from './client';

export const ROUTES = {
  REFRESH: '/tokens/reissue',
} as const;

export const authAPI = {
  reissueAuthToken: async (): Promise<string> => {
    const response = await apiClient.post(ROUTES.REFRESH, {
      refreshToken: getRefreshToken(),
    });

    return response.data;
  },
  getGoogleAccessToken: async ({
    codeVerifier,
    authorizationCode,
    redirectUri,
    platform,
  }: {
    codeVerifier: string;
    authorizationCode: string;
    redirectUri: string;
    platform: 'ANDROID' | 'IOS';
  }) => {
    const response = await apiClient.post('/login/google', {
      codeVerifier,
      authorizationCode,
      redirectUri,
      platform,
    });

    return response;
  },
  getKaKaoAccessToken: async (accessToken: string) => {
    const response = await apiClient.post('/login/kakao', {
      accessToken,
    });

    return response;
  },
};
