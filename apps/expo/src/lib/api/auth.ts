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
  LOGOUT: '/logout',
} as const;

export const authAPI = {
  reissueAuthToken: async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    console.log(combineUrl(ENV.BASE_URL, ROUTES.REFRESH));
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
  getKaKaoAccessToken: async ({
    identityToken,
    refreshToken,
  }: {
    identityToken: string;
    refreshToken: string;
  }) => {
    const response = await axios.post(combineUrl(ENV.BASE_URL, ROUTES.KAKAO), {
      identityToken,
      refreshToken,
    });

    return response.data;
  },
  // interceptor를 우회하기 위해 일반 axios 사용, 토큰을 파라미터로 받음
  logout: async (accessToken: string | null) => {
    if (!accessToken) return;

    await axios.post(
      combineUrl(ENV.BASE_URL, ROUTES.LOGOUT),
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },
};
