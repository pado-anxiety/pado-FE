import { render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import AnchorStepScreen from './step';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockShowAlertValidation = jest.fn();

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

jest.mock('@src/lib/alert', () => ({
  showAlert: { validation: (...args: unknown[]) => mockShowAlertValidation(...args) },
}));

jest.mock('@src/lib/analytics', () => ({
  ANALYTICS_KEY: { ACT: { ANCHOR: { FIVE: 'anchor_five' } } },
  useAnalytics: () => ({
    trackFunnelNext: jest.fn(),
    trackFunnelExit: jest.fn(),
    trackFunnelPrev: jest.fn(),
  }),
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: { HOME: '/', ACT: { ANCHOR: { RESULT: '/(act)/anchor/result' } } },
  WEBVIEW_ROUTES: { ACT: { ANCHOR: { STEP: '/act/anchor/step' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('AnchorStepScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: mockReplace,
    });
  });

  it('BACK 액션 수신 시 이전 화면으로 돌아간다', () => {
    render(<AnchorStepScreen />);
    sendMessage('NAVIGATE', { action: 'BACK', duration: 1000, step: 0 });
    expect(mockBack).toHaveBeenCalled();
  });

  it('HOME 액션 수신 시 홈으로 이동한다', () => {
    render(<AnchorStepScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 2000, step: 1 });
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('COMPLETE 메시지 수신 시 결과 화면으로 이동한다', () => {
    render(<AnchorStepScreen />);
    sendMessage('COMPLETE', { data: {} });
    expect(mockPush).toHaveBeenCalledWith('/(act)/anchor/result');
  });

  it('NEXT 액션 수신 시 화면 이동 없이 처리된다', () => {
    render(<AnchorStepScreen />);
    sendMessage('NAVIGATE', { action: 'NEXT', duration: 1000, step: 1 });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('VALIDATE 메시지 수신 시 알림을 표시한다', () => {
    render(<AnchorStepScreen />);
    sendMessage('VALIDATE', { title: '입력 오류', message: '값을 입력해주세요' });
    expect(mockShowAlertValidation).toHaveBeenCalledWith('입력 오류', '값을 입력해주세요');
  });

  it('HAPTIC 메시지는 네비게이션 없이 처리된다', () => {
    render(<AnchorStepScreen />);
    sendMessage('HAPTIC', { type: 'NAVIGATE' });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
