import { renderHook } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { WebViewMessageEvent } from 'react-native-webview';

import { useActStepMessageHandler } from './use-act-step-message-handler';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockTrackFunnelNext = jest.fn();
const mockTrackFunnelExit = jest.fn();
const mockTrackFunnelPrev = jest.fn();
const mockShowAlertValidation = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@src/lib/alert', () => ({
  showAlert: {
    validation: (...args: unknown[]) => mockShowAlertValidation(...args),
  },
}));

jest.mock('@src/lib/analytics', () => ({
  useAnalytics: () => ({
    trackFunnelNext: mockTrackFunnelNext,
    trackFunnelExit: mockTrackFunnelExit,
    trackFunnelPrev: mockTrackFunnelPrev,
  }),
}));

jest.mock('@src/lib/json', () => ({
  safeStringify: (obj: unknown) => JSON.stringify(obj),
}));

jest.mock('@src/lib/route/route', () => ({
  ROUTES: { HOME: '/' },
}));

jest.mock('@src/lib/haptics', () => ({
  triggerHaptic: jest.fn(),
}));

const createMockEvent = (type: string, data: unknown): WebViewMessageEvent =>
  ({
    nativeEvent: {
      data: JSON.stringify({ type, data }),
    },
  }) as WebViewMessageEvent;

describe('useActStepMessageHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: mockReplace,
    });
  });

  const renderHandler = () => {
    const { result } = renderHook(() =>
      useActStepMessageHandler({
        analyticsKey: 'test_key',
        resultRoute: '/test/result',
      }),
    );
    return result.current;
  };

  it('BACK 액션 수신 시 trackFunnelPrev 호출 후 뒤로 간다', () => {
    const handler = renderHandler();
    handler(
      createMockEvent('NAVIGATE', { action: 'BACK', duration: 1000, step: 2 }),
    );

    expect(mockTrackFunnelPrev).toHaveBeenCalledWith('test_key', 1000, 2);
    expect(mockBack).toHaveBeenCalled();
  });

  it('HOME 액션 수신 시 trackFunnelExit 호출 후 홈으로 이동한다', () => {
    const handler = renderHandler();
    handler(
      createMockEvent('NAVIGATE', { action: 'HOME', duration: 2000, step: 1 }),
    );

    expect(mockTrackFunnelExit).toHaveBeenCalledWith('test_key', 2000, 1);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('NEXT 액션 수신 시 trackFunnelNext 호출, 네비게이션 없음', () => {
    const handler = renderHandler();
    handler(
      createMockEvent('NAVIGATE', { action: 'NEXT', duration: 500, step: 3 }),
    );

    expect(mockTrackFunnelNext).toHaveBeenCalledWith('test_key', 500, 3);
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('step 없으면 -1로 대체된다', () => {
    const handler = renderHandler();
    handler(createMockEvent('NAVIGATE', { action: 'BACK', duration: 1000 }));

    expect(mockTrackFunnelPrev).toHaveBeenCalledWith('test_key', 1000, -1);
  });

  it('COMPLETE 메시지 수신 시 결과 화면으로 이동한다', () => {
    const handler = renderHandler();
    handler(createMockEvent('COMPLETE', { data: { value: 42 } }));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/test/result',
      params: { data: JSON.stringify({ value: 42 }) },
    });
  });

  it('VALIDATE 메시지 수신 시 알림을 표시한다', () => {
    const handler = renderHandler();
    handler(
      createMockEvent('VALIDATE', { title: '오류', message: '입력하세요' }),
    );

    expect(mockShowAlertValidation).toHaveBeenCalledWith('오류', '입력하세요');
  });
});
