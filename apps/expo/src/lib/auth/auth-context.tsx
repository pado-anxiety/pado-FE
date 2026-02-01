import { router } from 'expo-router';
import { create } from 'zustand';

import { authAPI } from '../api/auth';
import { userAPI } from '../api/user';
import { i18n } from '../i18n';
import { ROUTES } from '../route';
import { SignInWithApple } from './apple-login';
import { SignInWithGoogle } from './google-login';
import { SignInWithKakao } from './kakao-login';
import { authStorage } from './utils';

interface AuthState {
  name: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;

  login: (
    platform: 'google' | 'kakao' | 'apple',
  ) => Promise<void | { errorMessage: string } | { cancelled: true }>;

  logout: () => void;

  // API 호출 없이 로컬 인증 정보만 정리 (interceptor에서 사용)
  clearAuth: () => void;

  setAuthToken: (accessToken: string, refreshToken: string) => void;

  setUserInfo: (name: string, email: string) => void;
}

export const useAuth = create<AuthState>((set) => ({
  name: authStorage.getName(),
  email: authStorage.getEmail(),
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
        if ('cancelled' in result) return { cancelled: true };
        if ('errorMessage' in result) {
          return { errorMessage: result.errorMessage };
        }
        token.accessToken = result.accessToken;
        token.refreshToken = result.refreshToken;
      } else if (platform === 'kakao') {
        const result = await SignInWithKakao();
        if ('cancelled' in result) return { cancelled: true };
        if ('errorMessage' in result) {
          return { errorMessage: result.errorMessage };
        }
        token.accessToken = result.accessToken;
        token.refreshToken = result.refreshToken;
      } else if (platform === 'apple') {
        const result = await SignInWithApple();
        if ('cancelled' in result) return { cancelled: true };
        if ('errorMessage' in result) {
          return { errorMessage: result.errorMessage };
        }
        token.accessToken = result.accessToken;
        token.refreshToken = result.refreshToken;
      }

      if (!token.accessToken || !token.refreshToken) {
        return {
          errorMessage: i18n.t('auth.error.tokenFailed'),
        };
      }

      set({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      });

      authStorage.setAuthToken(token.accessToken, token.refreshToken);

      try {
        const user = await userAPI.getUser();

        const name = user.name;
        const email = user.email;

        authStorage.setUserInfo(name, email);

        set({
          name: name,
          email: email,
          isLoggedIn: true,
        });
      } catch (error) {
        console.error('Failed to load user:', error);
        return { errorMessage: i18n.t('auth.error.unexpected') };
      }
    } catch (error) {
      console.error(error);
      return { errorMessage: i18n.t('auth.error.unexpected') };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    // 토큰을 먼저 저장 (API 호출에 사용)
    const currentAccessToken = useAuth.getState().accessToken;

    set({ isLoading: true });

    // 로컬 상태와 스토리지 정리
    authStorage.clearAuthInfo();

    set({
      name: null,
      email: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      isLoading: false,
    });

    try {
      await authAPI.logout(currentAccessToken);
    } catch (error) {
      console.error('Logout API failed (ignored):', error);
    }

    router.replace(ROUTES.HOME);
  },

  clearAuth: () => {
    authStorage.clearAuthInfo();

    set({
      name: null,
      email: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      isLoading: false,
    });
  },

  setAuthToken: (accessToken: string, refreshToken: string) => {
    authStorage.setAuthToken(accessToken, refreshToken);

    set({
      accessToken: accessToken,
      refreshToken: refreshToken,
      isLoggedIn: true,
      isLoading: false,
    });
  },

  setUserInfo: (name: string, email: string) => {
    authStorage.setUserInfo(name, email);

    set({
      name: name,
      email: email,
    });
  },
}));
