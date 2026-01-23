import { render } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import LearningScreen from './learning';

const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34 }),
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
  View: ({ children }: { children: React.ReactNode }) => children,
  WebViewErrorView: () => null,
  WebViewLoadingView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@src/lib/analytics', () => ({
  useAnalytics: () => ({ trackFunnelNext: jest.fn() }),
}));

jest.mock('@src/lib/json', () => ({
  safeStringify: (obj: unknown) => JSON.stringify(obj),
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: { HOME: '/' },
  WEBVIEW_ROUTES: { LEARNING: '/learning' },
  getWebViewBaseURL: () => 'https://example.com',
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('LearningScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack, replace: mockReplace });
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      subject: 'anxiety_info',
      title: '불안은 왜 생기는 걸까요?',
      description: '불안에 대해 알아봅니다.',
    });
  });

  it('학습 데이터를 웹뷰에 주입한다', () => {
    render(<LearningScreen />);
    const injectedJS = (global as unknown as { __injectedJS: string }).__injectedJS;

    expect(injectedJS).toContain('window.learningData');
    expect(injectedJS).toContain('anxiety_info');
    expect(injectedJS).toContain('window.insets');
  });

  it('HOME 액션 수신 시 뒤로 이동한다', () => {
    render(<LearningScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 5000 });

    expect(mockBack).toHaveBeenCalled();
  });

  it('NEXT 액션 수신 시 화면 이동 없이 처리된다', () => {
    render(<LearningScreen />);
    sendMessage('NAVIGATE', { action: 'NEXT', duration: 3000, step: 0 });

    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
