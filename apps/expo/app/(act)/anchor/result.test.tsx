import { render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import AnchorResultScreen from './result';

const mockReplace = jest.fn();
const mockMutate = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useMutation: ({ mutationFn }: { mutationFn: () => void }) => ({
    mutate: () => {
      mockMutate();
      mutationFn();
    },
  }),
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
  useAnalytics: () => ({ trackFunnelComplete: jest.fn() }),
}));

jest.mock('@src/lib/api/act', () => ({
  actAPI: { anchor: jest.fn().mockResolvedValue({}) },
}));

jest.mock('@src/lib/route', () => ({
  ROUTES: { HOME: '/' },
  WEBVIEW_ROUTES: { ACT: { ANCHOR: { RESULT: '/act/anchor/result' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('AnchorResultScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it('렌더링된다', () => {
    render(<AnchorResultScreen />);
    expect((global as unknown as { __webViewOnMessage: unknown }).__webViewOnMessage).toBeDefined();
  });

  it('NAVIGATE 수신 시 API를 호출하고 홈으로 이동한다', () => {
    render(<AnchorResultScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 3000 });
    expect(mockMutate).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('중복 NAVIGATE 수신 시 API를 한 번만 호출한다', () => {
    render(<AnchorResultScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 3000 });
    sendMessage('NAVIGATE', { action: 'HOME', duration: 4000 });
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });
});
