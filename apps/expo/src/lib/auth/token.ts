import { storage } from '../store';

const ACCESS_TOKEN_KEY = 'accessToken';

export const getAccessToken = () => {
  const accessToken = storage.getString(ACCESS_TOKEN_KEY);
  if (!accessToken) {
    return null;
  }

  return accessToken;
};

export const setAccessToken = (accessToken: string) => {
  storage.set(ACCESS_TOKEN_KEY, accessToken);
};
