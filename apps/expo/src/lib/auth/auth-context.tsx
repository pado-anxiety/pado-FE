import { create } from 'zustand';

import { SignInWithGoogle } from './google-login';
import { SignInWithKakao } from './kakao-login';
import { authStorage } from './utils';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  login: (
    platform: 'google' | 'kakao',
  ) => Promise<void | { errorMessage: string }>;
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
        const result = await SignInWithGoogle();
        if ('errorMessage' in result) {
          return { errorMessage: result.errorMessage };
        }
        token.accessToken = result.accessToken;
        token.refreshToken = result.refreshToken;
      } else if (platform === 'kakao') {
        const result = await SignInWithKakao();
        if ('errorMessage' in result) {
          return { errorMessage: result.errorMessage };
        }
        token.accessToken = result.accessToken;
        token.refreshToken = result.refreshToken;
      }

      if (!token.accessToken || !token.refreshToken) {
        return {
          errorMessage: '로그인에 실패했습니다. 토큰을 받아올 수 없습니다.',
        };
      }

      authStorage.setAuthToken(token.accessToken, token.refreshToken);
      set({
        accessToken: token.accessToken + '------------a',
        refreshToken: token.refreshToken,
        isLoggedIn: true,
      });
    } catch (error) {
      console.error(error);
      return { errorMessage: '로그인 중 예상치 못한 오류가 발생했습니다.' };
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
