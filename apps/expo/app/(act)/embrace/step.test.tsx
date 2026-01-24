import { render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import EmbraceStepScreen from './step';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 47 }),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({
      onMessage,
      injectedJavaScriptBeforeContentLoaded,
    }: {
      onMessage: (event: unknown) => void;
      injectedJavaScriptBeforeContentLoaded?: string;
    }) => {
      React.useEffect(() => {
        (global as unknown as { __webViewOnMessage: typeof onMessage }).__webViewOnMessage = onMessage;
        (global as unknown as { __injectedJS: string | undefined }).__injectedJS = injectedJavaScriptBeforeContentLoaded;
      }, [onMessage, injectedJavaScriptBeforeContentLoaded]);
      return null;
    },
  };
});

jest.mock('@src/components/ui', () => ({
  LoadingSpinner: () => null,
  WebViewErrorView: () => null,
  WebViewLoadingView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@src/lib/analytics', () => ({
  ANALYTICS_KEY: { ACT: { EMBRACE: { DEEPEN: 'embrace_deepen' } } },
  useAnalytics: () => ({
    trackFunnelNext: jest.fn(),
    trackFunnelExit: jest.fn(),
    trackFunnelPrev: jest.fn(),
  }),
}));

jest.mock('@src/lib/json', () => ({
  safeStringify: (obj: unknown) => JSON.stringify(obj),
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: { HOME: '/', ACT: { EMBRACE: { RESULT: '/(act)/embrace/result' } } },
  WEBVIEW_ROUTES: { ACT: { EMBRACE: { STEP: '/act/embrace/step' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('EmbraceStepScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: mockReplace,
    });
  });

  it('window.topInsets에 safe area top 값을 주입한다', () => {
    render(<EmbraceStepScreen />);
    const injectedJS = (global as unknown as { __injectedJS: string }).__injectedJS;
    expect(injectedJS).toContain('window.topInsets');
    expect(injectedJS).toContain('47');
  });

  it('BACK 액션 수신 시 이전 화면으로 돌아간다', () => {
    render(<EmbraceStepScreen />);
    sendMessage('NAVIGATE', { action: 'BACK', duration: 1000, step: 0 });
    expect(mockBack).toHaveBeenCalled();
  });

  it('HOME 액션 수신 시 홈으로 이동한다', () => {
    render(<EmbraceStepScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 2000, step: 1 });
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('NEXT 액션 수신 시 화면 이동 없이 처리된다', () => {
    render(<EmbraceStepScreen />);
    sendMessage('NAVIGATE', { action: 'NEXT', duration: 1000, step: 1 });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('DATA 메시지 수신 시 호흡 시간을 결과 화면으로 전달한다', () => {
    render(<EmbraceStepScreen />);

    sendMessage('DATA', { data: { embraceResult: 60000 } });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(act)/embrace/result',
      params: { data: JSON.stringify({ embraceResult: 60000 }) },
    });
  });
});
