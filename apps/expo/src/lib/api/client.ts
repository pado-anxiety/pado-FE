import axios from 'axios';

import { getAccessToken } from '../auth';
import { ENV } from '../env';
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
    const accessToken = getAccessToken();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (isRefreshing) return;

    isRefreshing = true;

    if (error.response?.status === 401) {
      console.error('클라이언트 오류가 발생했습니다: ', error);

      // 엑세스 토큰 만료
      // 엑세스 토큰 재발급 API
      const newAccessToken = await authAPI.reissueAuthToken();
      console.log('newAccessToken: ', newAccessToken);
      // 해당 API 요청을 엑세스 토큰과 함께 재요청
      //  성공 시 MMKV 에 해당 토큰 저장
      //  실패 시 로그인 화면으로 전환
    }

    return Promise.reject(error);
  },
);
