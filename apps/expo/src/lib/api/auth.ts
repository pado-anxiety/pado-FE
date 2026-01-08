import axios from 'axios';

import { authStorage } from '../auth';

export const ROUTES = {
  REFRESH: '/tokens/reissue',
} as const;

export const authAPI = {
  reissueAuthToken: async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    const response: { accessToken: string; refreshToken: string } =
      await axios.post(`https://pado-anxiety.site/tokens/reissue`, {
        refreshToken: authStorage.getRefreshToken(),
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
  }): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await axios.post(
      'https://pado-anxiety.site/login/google',
      {
        codeVerifier,
        authorizationCode,
        redirectUri,
        platform,
      },
    );

    return response.data;
  },
  getKaKaoAccessToken: async (accessToken: string) => {
    const response = await axios.post('https://pado-anxiety.site/login/kakao', {
      accessToken,
    });

    return response.data;
  },
};
