import { render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import DiaryStepScreen from './step';

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
  ANALYTICS_KEY: { ACT: { DIARY: { EMOTION: 'diary_emotion' } } },
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
  ROUTES: { HOME: '/', ACT: { DIARY: { RESULT: '/(act)/diary/result' } } },
  WEBVIEW_ROUTES: { ACT: { DIARY: { STEP: '/act/diary/step' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('DiaryStepScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: mockReplace,
    });
  });

  it('DATA 메시지 수신 시 결과 화면으로 데이터를 전달하며 이동한다', () => {
    render(<DiaryStepScreen />);

    const diaryData = [
      { question: '상황', answer: '회사에서' },
      { question: '생각', answer: '힘들다' },
      { question: '감정', answer: '불안' },
    ];

    sendMessage('DATA', { data: diaryData });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(act)/diary/result',
      params: { data: JSON.stringify(diaryData) },
    });
  });

  it('BACK 액션 수신 시 이전 화면으로 돌아간다', () => {
    render(<DiaryStepScreen />);
    sendMessage('NAVIGATE', { action: 'BACK', duration: 1000, step: 0 });
    expect(mockBack).toHaveBeenCalled();
  });

  it('HOME 액션 수신 시 홈으로 이동한다', () => {
    render(<DiaryStepScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 2000, step: 1 });
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('VALIDATE 메시지 수신 시 알림을 표시한다', () => {
    render(<DiaryStepScreen />);
    sendMessage('VALIDATE', { title: '입력 필요', message: '내용을 입력하세요' });
    expect(mockShowAlertValidation).toHaveBeenCalledWith('입력 필요', '내용을 입력하세요');
  });
});
