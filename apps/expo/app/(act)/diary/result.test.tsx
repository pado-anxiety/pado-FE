import { render } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import DiaryResultScreen from './result';

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
  ANALYTICS_KEY: { ACT: { DIARY: { EMOTION: 'diary_emotion' } } },
  useAnalytics: () => ({ trackFunnelComplete: jest.fn() }),
}));

jest.mock('@src/lib/api/act', () => ({
  actAPI: { diary: jest.fn().mockResolvedValue({}) },
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
  WEBVIEW_ROUTES: { ACT: { DIARY: { RESULT: '/act/diary/result' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('DiaryResultScreen', () => {
  // Step screen does safeStringify(data) where data is already a JSON string from web
  // So the param is double-stringified: JSON.stringify('[{...}]') = '"[{...}]"'
  const innerData = JSON.stringify([
    { question: '상황', answer: '회사에서' },
    { question: '생각', answer: '힘들다' },
    { question: '감정', answer: '불안' },
  ]);
  const paramData = JSON.stringify(innerData); // double-stringified

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ data: paramData });
  });

  it('이전 스텝의 데이터를 웹뷰에 주입한다', () => {
    render(<DiaryResultScreen />);
    const injectedJS = (global as unknown as { __injectedJS: string }).__injectedJS;
    expect(injectedJS).toContain('window.diaryResult');
    expect(injectedJS).toContain('회사에서');
  });

  it('HOME 액션 수신 시 API에 데이터를 전달하고 홈으로 이동한다', () => {
    render(<DiaryResultScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 5000 });

    expect(mockMutate).toHaveBeenCalledWith({
      situation: '회사에서',
      thoughts: '힘들다',
      feelings: '불안',
    });
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('중복 NAVIGATE 수신 시 API를 한 번만 호출한다', () => {
    render(<DiaryResultScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 3000 });
    sendMessage('NAVIGATE', { action: 'HOME', duration: 4000 });
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });
});
