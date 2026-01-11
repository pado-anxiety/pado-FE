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
      await axios.post(`https://nyangtodac-dev.site/tokens/reissue`, {
        refreshToken: authStorage.getRefreshToken(),
      });

    console.log('토큰 재발급 response: ', response);

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
      'https://nyangtodac-dev.site/login/google',
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
    const response = await axios.post(
      'https://nyangtodac-dev.site/login/kakao',
      {
        accessToken,
      },
    );

    return response.data;
  },
};
