import axios from 'axios';
import { router } from 'expo-router';

import { authStorage } from '../auth';
import { ENV } from '../env';
import { ROUTES } from '../route';
import { authAPI } from './auth';

const BASE_URL = ENV.BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = authStorage.getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;

    if (status === 401 && !config._retry) {
      config._retry = true;

      try {
        const { accessToken, refreshToken } = await authAPI.reissueAuthToken();

        authStorage.setAuthToken(accessToken, refreshToken);

        return apiClient(config);
      } catch (error) {
        console.error('토큰 재발급 오류가 발생했습니다: ', error);
        router.replace(ROUTES.LOGIN);
      }
    }

    router.replace(ROUTES.LOGIN);
  },
);
