import { storage } from '../store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'userName';
const USER_EMAIL_KEY = 'userEmail';

export const parseAuthToken = (token: {
  accessToken: string;
  refreshToken: string;
}) => {
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  };
};

export const authStorage = {
  getName: () => {
    const name = storage.getString(USER_KEY);
    if (!name) {
      return null;
    }
    return name;
  },

  getEmail: () => {
    const email = storage.getString(USER_EMAIL_KEY);
    if (!email) {
      return null;
    }
    return email;
  },

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

  setAuthInfo: (
    accessToken: string,
    refreshToken: string,
    name: string,
    email: string,
  ) => {
    storage.set(ACCESS_TOKEN_KEY, accessToken);
    storage.set(REFRESH_TOKEN_KEY, refreshToken);
    storage.set(USER_KEY, name);
    storage.set(USER_EMAIL_KEY, email);
  },

  clearAuthInfo: () => {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
    storage.remove(USER_KEY);
    storage.remove(USER_EMAIL_KEY);
  },
};
