import axios from 'axios';

import { useAuth } from '../auth';
import { ENV } from '../env';

function combineUrl(base: string, path: string) {
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}

const AUTH_ENDPOINTS = {
  REFRESH: '/tokens/reissue',
  GOOGLE: '/login/google',
  KAKAO: '/login/kakao',
  APPLE: '/login/apple',
  LOGOUT: '/logout',
} as const;

/** @deprecated Use AUTH_ENDPOINTS instead */
export const ROUTES = AUTH_ENDPOINTS;

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
    }>(combineUrl(ENV.BASE_URL, AUTH_ENDPOINTS.REFRESH), {
      refreshToken: useAuth.getState().refreshToken,
    });

    return response.data;
  },
  getGoogleAccessToken: async ({
    codeVerifier,
    authorizationCode,
    redirectUri,
    platform,
    timezone,
  }: {
    codeVerifier: string;
    authorizationCode: string;
    redirectUri: string;
    platform: 'ANDROID' | 'IOS';
    timezone: string;
  }): Promise<AuthToken> => {
    const response = await axios.post<AuthToken>(
      combineUrl(ENV.BASE_URL, AUTH_ENDPOINTS.GOOGLE),
      {
        codeVerifier,
        authorizationCode,
        redirectUri,
        platform,
        timezone,
      },
    );

    return response.data;
  },
  getKaKaoAccessToken: async ({
    identityToken,
    refreshToken,
    timezone,
  }: {
    identityToken: string;
    refreshToken: string;
    timezone: string;
  }): Promise<AuthToken> => {
    const response = await axios.post(combineUrl(ENV.BASE_URL, AUTH_ENDPOINTS.KAKAO), {
      identityToken,
      refreshToken,
      timezone,
    });

    return response.data;
  },
  getAppleAccessToken: async ({
    authorizationCode,
    fullName,
    timezone,
  }: {
    authorizationCode: string;
    fullName: string | null;
    timezone: string;
  }): Promise<AuthToken> => {
    const response = await axios.post(combineUrl(ENV.BASE_URL, AUTH_ENDPOINTS.APPLE), {
      authorizationCode,
      fullName,
      timezone,
    });

    return response.data;
  },
  // interceptor를 우회하기 위해 일반 axios 사용, 토큰을 파라미터로 받음
  logout: async (accessToken: string | null) => {
    if (!accessToken) return;

    await axios.post(
      combineUrl(ENV.BASE_URL, AUTH_ENDPOINTS.LOGOUT),
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },
};
