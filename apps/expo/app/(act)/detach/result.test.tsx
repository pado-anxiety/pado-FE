import { render } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import DetachResultScreen from './result';

const mockReplace = jest.fn();
const mockMutate = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@tanstack/react-query', () => ({
  useMutation: ({ mutationFn }: { mutationFn: (args: unknown) => void }) => ({
    mutate: (args: unknown) => {
      mockMutate(args);
      mutationFn(args);
    },
  }),
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
  showAlert: { error: jest.fn() },
}));

jest.mock('@src/lib/analytics', () => ({
  ANALYTICS_KEY: { ACT: { DETACH: { SEPARATE: 'detach_separate' } } },
  useAnalytics: () => ({ trackFunnelComplete: jest.fn() }),
}));

jest.mock('@src/lib/api/act', () => ({
  actAPI: { detach: jest.fn().mockResolvedValue({}) },
}));

jest.mock('@src/lib/json', () => ({
  parseJSON: (str: string, onError?: () => void) => {
    try {
      return JSON.parse(str);
    } catch {
      onError?.();
      return null;
    }
  },
  safeStringify: (obj: unknown) => JSON.stringify(obj),
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: { HOME: '/' },
  WEBVIEW_ROUTES: { ACT: { DETACH: { RESULT: '/act/detach/result' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

jest.mock('@src/lib/route/route', () => ({
  ROUTES: { HOME: '/' },
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('DetachResultScreen', () => {
  const tokenData = [
    { text: '나는', isSelected: false },
    { text: '실패자다', isSelected: true },
  ];
  const paramData = JSON.stringify(tokenData);

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ data: paramData });
  });

  it('이전 스텝의 데이터를 웹뷰에 주입한다', () => {
    render(<DetachResultScreen />);
    const injectedJS = (global as unknown as { __injectedJS: string }).__injectedJS;
    expect(injectedJS).toContain('window.detachResult');
    expect(injectedJS).toContain('나는');
    expect(injectedJS).toContain('실패자다');
  });

  it('HOME 액션 수신 시 API에 토큰 데이터를 전달하고 홈으로 이동한다', () => {
    render(<DetachResultScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 5000 });

    const { actAPI } = require('@src/lib/api/act');
    expect(actAPI.detach).toHaveBeenCalledWith({
      userTextToken: tokenData,
    });
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('중복 NAVIGATE 수신 시 API를 한 번만 호출한다', () => {
    render(<DetachResultScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 3000 });
    sendMessage('NAVIGATE', { action: 'HOME', duration: 4000 });
    const { actAPI } = require('@src/lib/api/act');
    expect(actAPI.detach).toHaveBeenCalledTimes(1);
  });
});
