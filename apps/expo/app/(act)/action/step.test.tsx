import { render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import ActionStepScreen from './step';

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
  ANALYTICS_KEY: { ACT: { ACTION: { VALUES: 'action_values' } } },
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
  ROUTES: { HOME: '/', ACT: { ACTION: { RESULT: '/(act)/action/result' } } },
  WEBVIEW_ROUTES: { ACT: { ACTION: { STEP: '/act/action/step' } } },
  getWebViewBaseURL: () => 'https://example.com',
}));

jest.mock('@src/lib/route/route', () => ({
  ROUTES: { HOME: '/', ACT: { ACTION: { RESULT: '/(act)/action/result' } } },
}));

const sendMessage = (type: string, data: unknown) => {
  const onMessage = (global as unknown as { __webViewOnMessage: (e: unknown) => void }).__webViewOnMessage;
  onMessage({ nativeEvent: { data: JSON.stringify({ type, data }) } });
};

describe('ActionStepScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: mockReplace,
    });
  });

  it('BACK 액션 수신 시 이전 화면으로 돌아간다', () => {
    render(<ActionStepScreen />);
    sendMessage('NAVIGATE', { action: 'BACK', duration: 1000, step: 0 });
    expect(mockBack).toHaveBeenCalled();
  });

  it('HOME 액션 수신 시 홈으로 이동한다', () => {
    render(<ActionStepScreen />);
    sendMessage('NAVIGATE', { action: 'HOME', duration: 2000, step: 1 });
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('NEXT 액션 수신 시 화면 이동 없이 처리된다', () => {
    render(<ActionStepScreen />);
    sendMessage('NAVIGATE', { action: 'NEXT', duration: 1000, step: 1 });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('VALIDATE 메시지 수신 시 알림을 표시한다', () => {
    render(<ActionStepScreen />);
    sendMessage('VALIDATE', { title: '입력 오류', message: '값을 선택해주세요' });
    expect(mockShowAlertValidation).toHaveBeenCalledWith('입력 오류', '값을 선택해주세요');
  });

  it('DATA 메시지 수신 시 결과 화면으로 복합 데이터를 전달하며 이동한다', () => {
    render(<ActionStepScreen />);

    const actionData = {
      selectedValue: { work: 7, growth: 5, leisure: 3, relationship: 8 },
      selectedDomain: 'relationship',
      orientation: '가족과 시간 보내기',
      obstacle: '업무가 너무 바쁨',
      action: '매주 일요일 저녁 가족 식사',
    };

    sendMessage('DATA', { data: actionData });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(act)/action/result',
      params: { data: JSON.stringify(actionData) },
    });
  });
});
