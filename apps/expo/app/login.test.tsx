import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react-native';

// Import after mocks
import LoginScreen from './login';

// Mock dependencies
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.app.name': '냥토닥',
        'home.app.tagline': '불안과 함께하는',
        'home.app.description': '마음 챙김 앱',
        'auth.login.continueWithApple': 'Apple로 계속하기',
        'auth.login.continueWithGoogle': 'Google로 계속하기',
        'auth.login.continueWithKakao': '카카오로 계속하기',
        'auth.login.termsAgreement': '로그인 시 이용약관에 동의합니다',
        'common.error.tryLater': '잠시 후 다시 시도해주세요',
      };
      return translations[key] || key;
    },
  }),
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

      expect(getByText('냥토닥')).toBeTruthy();
      expect(getByText('불안과 함께하는')).toBeTruthy();
      expect(getByText('마음 챙김 앱')).toBeTruthy();
    });

    it('Apple 로그인 버튼이 표시된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('Apple로 계속하기')).toBeTruthy();
    });

    it('Google 로그인 버튼이 표시된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('Google로 계속하기')).toBeTruthy();
    });

    it('카카오 로그인 버튼이 표시된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('카카오로 계속하기')).toBeTruthy();
    });

    it('이용약관 동의 텍스트가 표시된다', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('로그인 시 이용약관에 동의합니다')).toBeTruthy();
    });
  });

  describe('Apple 로그인', () => {
    it('Apple 로그인 버튼 클릭 시 login("apple")이 호출된다', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByText } = render(<LoginScreen />);
      const appleButton = getByText('Apple로 계속하기');

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('apple');
      });
    });

    it('Apple 로그인 실패 시 에러 알림이 표시된다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: 'Apple 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const appleButton = getByText('Apple로 계속하기');

      fireEvent.press(appleButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalledWith(
          'Apple 로그인 실패',
          '잠시 후 다시 시도해주세요',
        );
      });
    });

    it('Apple 로그인 실패 시 홈 화면으로 이동하지 않는다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: 'Apple 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const appleButton = getByText('Apple로 계속하기');

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
      const googleButton = getByText('Google로 계속하기');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('google');
      });
    });

    it('Google 로그인 성공 시 홈 화면으로 이동한다', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByText } = render(<LoginScreen />);
      const googleButton = getByText('Google로 계속하기');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith('/home');
      });
    });

    it('Google 로그인 실패 시 에러 알림이 표시된다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: 'Google 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const googleButton = getByText('Google로 계속하기');

      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalledWith(
          'Google 로그인 실패',
          '잠시 후 다시 시도해주세요',
        );
      });
    });

    it('Google 로그인 실패 시 홈 화면으로 이동하지 않는다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: 'Google 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const googleButton = getByText('Google로 계속하기');

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
      const kakaoButton = getByText('카카오로 계속하기');

      fireEvent.press(kakaoButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('kakao');
      });
    });

    it('카카오 로그인 성공 시 홈 화면으로 이동한다', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByText } = render(<LoginScreen />);
      const kakaoButton = getByText('카카오로 계속하기');

      fireEvent.press(kakaoButton);

      await waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith('/home');
      });
    });

    it('카카오 로그인 실패 시 에러 알림이 표시된다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: '카카오 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const kakaoButton = getByText('카카오로 계속하기');

      fireEvent.press(kakaoButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalledWith(
          '카카오 로그인 실패',
          '잠시 후 다시 시도해주세요',
        );
      });
    });

    it('카카오 로그인 실패 시 홈 화면으로 이동하지 않는다', async () => {
      mockLogin.mockResolvedValue({ errorMessage: '카카오 로그인 실패' });

      const { getByText } = render(<LoginScreen />);
      const kakaoButton = getByText('카카오로 계속하기');

      fireEvent.press(kakaoButton);

      await waitFor(() => {
        expect(mockShowAlertError).toHaveBeenCalled();
      });

      expect(mockRouterReplace).not.toHaveBeenCalled();
    });
  });
});
