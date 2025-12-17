import axios from 'axios';

import { ENV } from '../env';

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
    // const accessToken = storage.getString('accessToken');
    const accessToken = ENV.ACCESS_TOKEN;
    console.log('accessToken: ', accessToken);

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
  (error) => {
    if (error.response?.status === 401) {
      console.log('토큰이 만료되었습니다. 로그아웃 처리가 필요합니다.');
    }

    return Promise.reject(error);
  },
);
