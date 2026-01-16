import { router } from 'expo-router';
import { create } from 'zustand';

import { authAPI } from '../api/auth';
import { i18n } from '../i18n';
import { ROUTES } from '../route';
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

  setAuthToken: (accessToken: string, refreshToken: string) => void;
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
          errorMessage: i18n.t('auth.error.tokenFailed'),
        };
      }

      authStorage.setAuthToken(token.accessToken, token.refreshToken);

      set({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        isLoggedIn: true,
      });
    } catch (error) {
      console.error(error);
      return { errorMessage: i18n.t('auth.error.unexpected') };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();

      set({ isLoading: true });

      authStorage.clearAuthToken();

      set({
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      return { errorMessage: i18n.t('auth.error.logoutUnexpected') };
    } finally {
      router.replace(ROUTES.HOME);
    }
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
}));
