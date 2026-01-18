import { router } from 'expo-router';
import { create } from 'zustand';

import { authAPI } from '../api/auth';
import { userAPI } from '../api/user';
import { i18n } from '../i18n';
import { ROUTES } from '../route';
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
    platform: 'google' | 'kakao',
  ) => Promise<void | { errorMessage: string }>;

  logout: () => void;

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
    try {
      await authAPI.logout();

      set({ isLoading: true });

      authStorage.clearAuthInfo();

      set({
        name: null,
        email: null,
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

  setUserInfo: (name: string, email: string) => {
    authStorage.setUserInfo(name, email);

    set({
      name: name,
      email: email,
    });
  },
}));
