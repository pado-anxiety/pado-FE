import axios from 'axios';
import { router } from 'expo-router';

import { showAlert } from '../alert';
import { useAuth } from '../auth';
import { ENV } from '../env';
import { i18n } from '../i18n';
import { ROUTES } from '../route';
import { authAPI } from './auth';

const BASE_URL = ENV.BASE_URL;
console.log('BASE_URL: ', BASE_URL);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuth.getState().accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let refreshPromise: Promise<{
  accessToken: string;
  refreshToken: string;
}> | null = null;

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const config = error.config;
    const status = error.response?.status;

    if (status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    // 이미 로그아웃 상태(토큰 없음)인 경우 재발급 시도하지 않음
    const currentRefreshToken = useAuth.getState().refreshToken;
    if (!currentRefreshToken) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      // 이미 진행 중인 refresh가 없을 때만 새로 시작
      if (!refreshPromise) {
        refreshPromise = authAPI.reissueAuthToken();
      }

      const { accessToken, refreshToken } = await refreshPromise;

      useAuth.getState().setAuthToken(accessToken, refreshToken);

      return apiClient(config);
    } catch (reissueError) {
      // ACT 결과 저장 등 조용히 실패해야 하는 요청은 clearAuth/알림 없이 넘김
      if (config._silentAuthFailure) {
        return Promise.reject(reissueError);
      }

      useAuth.getState().clearAuth();

      showAlert.warning(
        i18n.t('common.error.loginRequired'),
        i18n.t('common.error.goToLogin'),
        () => router.replace(ROUTES.LOGIN),
      );

      return Promise.reject(reissueError);
    } finally {
      refreshPromise = null;
    }
  },
);
