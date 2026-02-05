import { render } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import EmbraceResultScreen from './result';

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
  ANALYTICS_KEY: { ACT: { EMBRACE: { DEEPEN: 'embrace_deepen' } } },
  useAnalytics: () => ({ trackFunnelComplete: jest.fn() }),
}));

jest.mock('@src/lib/api/act', () => ({
  actAPI: { embrace: jest.fn().mockResolvedValue({}) },
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
  WEBVIEW_ROUTES: { ACT: { EMBRACE: { RESULT: '/act/embrace/result' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

jest.mock('@src/lib/route/route', () => ({
  ROUTES: { HOME: '/' },
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('EmbraceResultScreen', () => {
  const embraceData = { embraceResult: 60000 };
  const paramData = JSON.stringify(embraceData);

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ data: paramData });
  });

  it('호흡 시간 데이터를 웹뷰에 주입한다', () => {
    render(<EmbraceResultScreen />);
    const injectedJS = (global as unknown as { __injectedJS: string }).__injectedJS;
    expect(injectedJS).toContain('window.embraceResult');
    expect(injectedJS).toContain('60000');
  });

  it('HOME 액션 수신 시 API에 호흡 시간을 전달하고 홈으로 이동한다', () => {
    render(<EmbraceResultScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 5000 });

    const { actAPI } = require('@src/lib/api/act');
    expect(actAPI.embrace).toHaveBeenCalledWith({
      breathingTime: 60000,
    });
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('중복 NAVIGATE 수신 시 API를 한 번만 호출한다', () => {
    render(<EmbraceResultScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 3000 });
    sendMessage('NAVIGATE', { action: 'HOME', duration: 4000 });
    const { actAPI } = require('@src/lib/api/act');
    expect(actAPI.embrace).toHaveBeenCalledTimes(1);
  });
});
