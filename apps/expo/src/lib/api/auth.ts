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
  APPLE: '/login/apple',
  LOGOUT: '/logout',
} as const;

interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export const authAPI = {
  reissueAuthToken: async (): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    const response = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(combineUrl(ENV.BASE_URL, ROUTES.REFRESH), {
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
  }): Promise<AuthToken> => {
    const response = await axios.post<AuthToken>(
      combineUrl(ENV.BASE_URL, ROUTES.GOOGLE),
      {
        codeVerifier,
        authorizationCode,
        redirectUri,
        platform,
      },
    );

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
  getAppleAccessToken: async ({
    authorizationCode,
    fullName,
  }: {
    authorizationCode: string;
    fullName: string | null;
  }) => {
    const response = await axios.post(combineUrl(ENV.BASE_URL, ROUTES.APPLE), {
      authorizationCode,
      fullName,
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
