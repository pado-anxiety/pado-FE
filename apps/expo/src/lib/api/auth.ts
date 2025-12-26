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
  getAccessToken: async ({
    codeVerifier,
    authorizationCode,
    redirectUri,
    platform,
  }: {
    codeVerifier: string;
    authorizationCode: string;
    redirectUri: string | null;
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
};
