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
      console.error('클라이언트 오류가 발생했습니다: ', error);
    }

    return Promise.reject(error);
  },
);
