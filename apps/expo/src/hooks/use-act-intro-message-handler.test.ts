import { renderHook } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { WebViewMessageEvent } from 'react-native-webview';

import { useActIntroMessageHandler } from './use-act-intro-message-handler';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockTrackFunnelIntroNext = jest.fn();
const mockTrackFunnelIntroExit = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@src/lib/analytics', () => ({
  useAnalytics: () => ({
    trackFunnelIntroNext: mockTrackFunnelIntroNext,
    trackFunnelIntroExit: mockTrackFunnelIntroExit,
  }),
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

describe('useActIntroMessageHandler', () => {
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
      useActIntroMessageHandler({
        analyticsKey: 'test_key',
        stepRoute: '/test/step',
      }),
    );
    return result.current;
  };

  it('NEXT 액션 수신 시 trackFunnelIntroNext 호출 후 step 화면으로 이동한다', () => {
    const handler = renderHandler();
    handler(createMockEvent('NAVIGATE', { action: 'NEXT', duration: 1000 }));

    expect(mockTrackFunnelIntroNext).toHaveBeenCalledWith('test_key', 1000);
    expect(mockPush).toHaveBeenCalledWith('/test/step');
  });

  it('HOME 액션 수신 시 trackFunnelIntroExit 호출 후 뒤로 간다', () => {
    const handler = renderHandler();
    handler(createMockEvent('NAVIGATE', { action: 'HOME', duration: 2000 }));

    expect(mockTrackFunnelIntroExit).toHaveBeenCalledWith('test_key', 2000);
    expect(mockBack).toHaveBeenCalled();
  });

  it('NEXT/HOME 이외의 액션은 무시된다', () => {
    const handler = renderHandler();
    handler(createMockEvent('NAVIGATE', { action: 'BACK', duration: 500 }));

    expect(mockTrackFunnelIntroNext).not.toHaveBeenCalled();
    expect(mockTrackFunnelIntroExit).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockBack).not.toHaveBeenCalled();
  });
});
