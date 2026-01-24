import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react-native';

import koAuth from '@pado/locales/ko/auth.json';
import koCommon from '@pado/locales/ko/common.json';
import koHome from '@pado/locales/ko/home.json';

import LoginScreen from './login';

const mockLogin = jest.fn();
const mockRouterReplace = jest.fn();
const mockShowAlertError = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  }),
}));

jest.mock('react-native-size-matters', () => ({
  scale: (size: number) => size,
}));

jest.mock('@/lib/auth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock('@/lib/alert', () => ({
  showAlert: {
    error: (title: string, message: string) =>
      mockShowAlertError(title, message),
  },
}));

jest.mock('@/lib/route', () => ({
  ROUTES: {
    HOME: '/home',
  },
}));

// 번역 키 조회 헬퍼
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const keys = path.split('.');
  let result: unknown = obj;
  for (const key of keys) {
    result = (result as Record<string, unknown>)?.[key];
  }
  return (result as string) || path;
};

// 실제 번역 파일 기반 t 함수
const translations: Record<string, Record<string, unknown>> = {
  home: koHome,
  auth: koAuth,
  common: koCommon,
};

const t = (key: string): string => {
  const [namespace, ...rest] = key.split('.');
  const namespaceObj = translations[namespace];
  if (!namespaceObj) return key;
  return getNestedValue(
    namespaceObj as Record<string, unknown>,
    rest.join('.'),
  );
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t }),
}));

jest.mock('@pado/ui', () => ({
  Text: 'Text',
}));

jest.mock('@/components/ui', () => ({
  Image: 'Image',
  Pressable: 'Pressable',
  View: 'View',
}));

jest.mock('@/features/home', () => ({
  WaveHorizon: 'WaveHorizon',
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('렌더링', () => {
    it('로그인 화면이 올바르게 렌더링된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText(t('home.app.name'))).toBeTruthy();
      expect(getByText(t('home.app.tagline'))).toBeTruthy();
      expect(getByText(t('home.app.description'))).toBeTruthy();
    });

    it('Apple 로그인 버튼이 표시된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText(t('auth.login.continueWithApple'))).toBeTruthy();
    });

    it('Google 로그인 버튼이 표시된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText(t('auth.login.continueWithGoogle'))).toBeTruthy();
    });

    it('카카오 로그인 버튼이 표시된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText(t('auth.login.continueWithKakao'))).toBeTruthy();
    });

    it('이용약관 동의 텍스트가 표시된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText(t('auth.login.termsAgreement'))).toBeTruthy();
    });
  });

  describe('Apple 로그인', () => {
    it('Apple 로그인 버튼 클릭 시 login("apple")이 호출된다', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByText } = render(<LoginScreen />);
      const appleButton = getByText(t('auth.login.continueWithApple'));

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('apple');
      });
    });

    it('Apple 로그인 실패 시 에러 알림이 표시된다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: 'Apple 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const appleButton = getByText(t('auth.login.continueWithApple'));

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalledWith(
          'Apple 로그인 실패',
          t('common.error.tryLater'),
        );
      });
    });

    it('Apple 로그인 실패 시 홈 화면으로 이동하지 않는다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: 'Apple 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const appleButton = getByText(t('auth.login.continueWithApple'));

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      expect(mockRouterReplace).not.toHaveBeenCalled();
    });
  });

  describe('Google 로그인', () => {
    it('Google 로그인 버튼 클릭 시 login("google")이 호출된다', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByText } = render(<LoginScreen />);
      const googleButton = getByText(t('auth.login.continueWithGoogle'));

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('google');
      });
    });

    it('Google 로그인 성공 시 홈 화면으로 이동한다', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByText } = render(<LoginScreen />);
      const googleButton = getByText(t('auth.login.continueWithGoogle'));

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith('/home');
      });
    });

    it('Google 로그인 실패 시 에러 알림이 표시된다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: 'Google 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const googleButton = getByText(t('auth.login.continueWithGoogle'));

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalledWith(
          'Google 로그인 실패',
          t('common.error.tryLater'),
        );
      });
    });

    it('Google 로그인 실패 시 홈 화면으로 이동하지 않는다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: 'Google 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const googleButton = getByText(t('auth.login.continueWithGoogle'));

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalled();
      });

      expect(mockRouterReplace).not.toHaveBeenCalled();
    });
  });

  describe('카카오 로그인', () => {
    it('카카오 로그인 버튼 클릭 시 login("kakao")가 호출된다', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByText } = render(<LoginScreen />);
      const kakaoButton = getByText(t('auth.login.continueWithKakao'));

      fireEvent.press(kakaoButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('kakao');
      });
    });

    it('카카오 로그인 성공 시 홈 화면으로 이동한다', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByText } = render(<LoginScreen />);
      const kakaoButton = getByText(t('auth.login.continueWithKakao'));

      fireEvent.press(kakaoButton);

      await waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith('/home');
      });
    });

    it('카카오 로그인 실패 시 에러 알림이 표시된다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: '카카오 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const kakaoButton = getByText(t('auth.login.continueWithKakao'));

      fireEvent.press(kakaoButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalledWith(
          '카카오 로그인 실패',
          t('common.error.tryLater'),
        );
      });
    });

    it('카카오 로그인 실패 시 홈 화면으로 이동하지 않는다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: '카카오 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const kakaoButton = getByText(t('auth.login.continueWithKakao'));

      fireEvent.press(kakaoButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalled();
      });

      expect(mockRouterReplace).not.toHaveBeenCalled();
    });
  });
});
