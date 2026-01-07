import axios from 'axios';

import { authStorage } from '../auth';
import { apiClient } from './client';

export const ROUTES = {
  REFRESH: '/tokens/reissue',
} as const;

export const authAPI = {
  reissueAuthToken: async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    const response: { accessToken: string; refreshToken: string } =
      await axios.post(`https://nyangtodac-dev.site/tokens/reissue`, {
        refreshToken: authStorage.getRefreshToken(),
      });

    return response;
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
  }): Promise<{ accessToken: string; refreshToken: string }> => {
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
