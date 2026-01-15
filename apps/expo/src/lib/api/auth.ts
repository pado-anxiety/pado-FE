import axios from 'axios';

import { useAuth } from '../auth';
import { ENV } from '../env';

function combineUrl(base: string, path: string) {
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}

export const ROUTES = {
  REFRESH: '/tokens/reissue',
  GOOGLE: '/login/google',
  KAKAO: '/login/kakao',
} as const;

export const authAPI = {
  reissueAuthToken: async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    const response: { accessToken: string; refreshToken: string } =
      await axios.post(combineUrl(ENV.BASE_URL, ROUTES.REFRESH), {
        refreshToken: useAuth.getState().refreshToken,
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
    const response = await axios.post(combineUrl(ENV.BASE_URL, ROUTES.GOOGLE), {
      codeVerifier,
      authorizationCode,
      redirectUri,
      platform,
    });

    return response.data;
  },
  getKaKaoAccessToken: async (accessToken: string) => {
    const response = await axios.post(combineUrl(ENV.BASE_URL, ROUTES.KAKAO), {
      accessToken,
    });

    return response.data;
  },
};
