import { render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import { setIsOnboarded } from '@src/lib';
import { ROUTES } from '@src/lib/route';

import OnboardScreen from './onboard';

// Mocks
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onMessage }: { onMessage: (event: unknown) => void }) => {
      // 컴포넌트를 ref로 노출하여 테스트에서 메시지를 보낼 수 있게 함
      React.useEffect(() => {
        (
          global as unknown as { __webViewOnMessage: typeof onMessage }
        ).__webViewOnMessage = onMessage;
      }, [onMessage]);
      return null;
    },
  };
});

jest.mock('@src/lib', () => ({
  setIsOnboarded: jest.fn(),
}));

jest.mock('@src/lib/analytics', () => ({
  ANALYTICS_KEY: { ONBOARD: 'onboard' },
  useAnalytics: () => ({
    trackFunnelNext: jest.fn(),
  }),
}));

jest.mock('@src/lib/json', () => ({
  safeStringify: (obj: unknown) => JSON.stringify(obj),
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: { LOGIN: '/login', HOME: '/' },
  WEBVIEW_ROUTES: { ONBOARD: '/onboard' },
  getWebViewBaseURL: () => 'https://example.com',
}));

jest.mock('@src/components/ui', () => ({
  LoadingSpinner: () => null,
  WebViewErrorView: () => null,
  WebViewLoadingView: ({ children }: { children: React.ReactNode }) => children,
}));

const mockReplace = jest.fn();
const mockSetIsOnboarded = setIsOnboarded as jest.Mock;

describe('OnboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it('렌더링된다', () => {
    render(<OnboardScreen />);
    // WebView가 렌더링되면 onMessage 핸들러가 전역에 등록됨
    expect(
      (global as unknown as { __webViewOnMessage: unknown }).__webViewOnMessage,
    ).toBeDefined();
  });

  describe('웹뷰 메시지 핸들링', () => {
    it('LOGIN 액션 수신 시 온보딩 완료 설정 후 로그인 화면으로 이동한다', () => {
      render(<OnboardScreen />);

      const onMessage = (
        global as unknown as { __webViewOnMessage: (event: unknown) => void }
      ).__webViewOnMessage;

      onMessage({
        nativeEvent: {
          data: JSON.stringify({
            type: 'NAVIGATE',
            data: { action: 'LOGIN', duration: 5000, step: 7 },
          }),
        },
      });

      expect(mockSetIsOnboarded).toHaveBeenCalledWith(true);
      expect(mockReplace).toHaveBeenCalledWith(ROUTES.LOGIN);
    });

    it('NEXT 액션 수신 시 네비게이션하지 않는다', () => {
      render(<OnboardScreen />);

      const onMessage = (
        global as unknown as { __webViewOnMessage: (event: unknown) => void }
      ).__webViewOnMessage;

      onMessage({
        nativeEvent: {
          data: JSON.stringify({
            type: 'NAVIGATE',
            data: { action: 'NEXT', duration: 1000, step: 0 },
          }),
        },
      });

      expect(mockSetIsOnboarded).not.toHaveBeenCalled();
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
