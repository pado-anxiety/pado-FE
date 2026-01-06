import { create } from 'zustand';

import { SignInWithGoogle } from './google-login';
import { SignInWithKakao } from './kakao-login';
import { authStorage } from './utils';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  login: (platform: 'google' | 'kakao') => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  accessToken: authStorage.getAccessToken(),
  refreshToken: authStorage.getRefreshToken(),
  isLoggedIn: !!authStorage.getAccessToken(),
  isLoading: false,

  login: async (platform) => {
    set({ isLoading: true });

    try {
      const token = {
        accessToken: '',
        refreshToken: '',
      };

      if (platform === 'google') {
        const { accessToken, refreshToken } = await SignInWithGoogle();
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
      } else if (platform === 'kakao') {
        const { accessToken, refreshToken } = await SignInWithKakao();
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
      }

      if (!token.accessToken || !token.refreshToken) {
        throw new Error('로그인 실패');
      }

      authStorage.setAuthToken(token.accessToken, token.refreshToken);
      set({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        isLoggedIn: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ isLoading: true });
    authStorage.clearAuthToken();
    set({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      isLoading: false,
    });
  },
}));
