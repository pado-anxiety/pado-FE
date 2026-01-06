import { storage } from '../store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const parseGoogleAuthToken = (token: {
  accessToken: string;
  refreshToken: string;
}) => {
  console.log('token: ', token);
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  };
};

export const authStorage = {
  getAccessToken: () => {
    const accessToken = storage.getString(ACCESS_TOKEN_KEY);
    if (!accessToken) {
      return null;
    }

    return accessToken;
  },

  getRefreshToken: () => {
    const refreshToken = storage.getString(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return null;
    }

    return refreshToken;
  },

  setAuthToken: (accessToken: string, refreshToken: string) => {
    storage.set(ACCESS_TOKEN_KEY, accessToken);
    storage.set(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearAuthToken: () => {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
  },
};
