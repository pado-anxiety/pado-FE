import { create } from 'zustand';

import { authStorage } from './utils';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  accessToken: authStorage.getAccessToken(),
  refreshToken: authStorage.getRefreshToken(),
  isLoggedIn: !!authStorage.getAccessToken(),

  login: (accessToken, refreshToken) => {
    authStorage.setAuthToken(accessToken, refreshToken);
    set({ accessToken, refreshToken, isLoggedIn: true });
  },

  logout: () => {
    authStorage.clearAuthToken();
    set({ accessToken: null, refreshToken: null, isLoggedIn: false });
  },
}));
