import { render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import AnchorScreen from './index';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onMessage }: { onMessage: (event: unknown) => void }) => {
      React.useEffect(() => {
        (global as unknown as { __webViewOnMessage: typeof onMessage }).__webViewOnMessage = onMessage;
      }, [onMessage]);
      return null;
    },
  };
});

jest.mock('@src/components/layout/page-safe-area-view', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: ({ children }: { children: React.ReactNode }) => <View>{children}</View> };
});

jest.mock('@src/components/ui', () => ({
  LoadingSpinner: () => null,
  WebViewErrorView: () => null,
  WebViewLoadingView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@src/lib/analytics', () => ({
  ANALYTICS_KEY: { ACT: { ANCHOR: { FIVE: 'anchor_five' } } },
  useAnalytics: () => ({
    trackFunnelIntroNext: jest.fn(),
    trackFunnelIntroExit: jest.fn(),
  }),
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: { HOME: '/', ACT: { ANCHOR: { STEP: '/(act)/anchor/step' } } },
  WEBVIEW_ROUTES: { ACT: { ANCHOR: { BASE: '/act/anchor' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('AnchorScreen (Intro)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: mockReplace,
    });
  });

  it('렌더링된다', () => {
    render(<AnchorScreen />);
    expect((global as unknown as { __webViewOnMessage: unknown }).__webViewOnMessage).toBeDefined();
  });

  it('NEXT 액션 수신 시 Step 화면으로 이동한다', () => {
    render(<AnchorScreen />);
    sendMessage('NAVIGATE', { action: 'NEXT', duration: 3000 });
    expect(mockPush).toHaveBeenCalledWith('/(act)/anchor/step');
  });

  it('HOME 액션 수신 시 뒤로 이동한다', () => {
    render(<AnchorScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 2000 });
    expect(mockBack).toHaveBeenCalled();
  });

  it('HAPTIC 메시지는 네비게이션 없이 처리된다', () => {
    render(<AnchorScreen />);
    sendMessage('HAPTIC', { type: 'SELECT' });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
  });
});
