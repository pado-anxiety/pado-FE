import { renderHook } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { WebViewMessageEvent } from 'react-native-webview';

import { useActResultData } from './use-act-result-data';

const mockReplace = jest.fn();
const mockTrackFunnelComplete = jest.fn();
const mockMutationFn = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useMutation: ({ mutationFn }: { mutationFn: () => Promise<void> }) => ({
    mutate: () => mutationFn(),
  }),
}));

jest.mock('@src/lib/analytics', () => ({
  useAnalytics: () => ({
    trackFunnelComplete: mockTrackFunnelComplete,
  }),
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

describe('useActResultData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: jest.fn(),
      back: jest.fn(),
    });
  });

  const renderHandler = (mutateOnHomeOnly = false) => {
    const { result } = renderHook(() =>
      useActResultData({
        analyticsKey: 'test_key',
        mutationFn: mockMutationFn,
        mutateOnHomeOnly,
      }),
    );
    return result.current;
  };

  it('NAVIGATE 수신 시 mutation 실행 후 홈으로 이동한다', () => {
    const handler = renderHandler();
    handler(createMockEvent('NAVIGATE', { action: 'HOME', duration: 1000 }));

    expect(mockMutationFn).toHaveBeenCalled();
    expect(mockTrackFunnelComplete).toHaveBeenCalledWith('test_key', 1000);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('mutation은 한 번만 실행된다', () => {
    const handler = renderHandler();
    handler(createMockEvent('NAVIGATE', { action: 'HOME', duration: 1000 }));
    handler(createMockEvent('NAVIGATE', { action: 'HOME', duration: 2000 }));

    expect(mockMutationFn).toHaveBeenCalledTimes(1);
    expect(mockTrackFunnelComplete).toHaveBeenCalledTimes(2);
  });

  it('mutateOnHomeOnly=true 일 때 HOME 이외 액션은 무시된다', () => {
    const handler = renderHandler(true);
    handler(createMockEvent('NAVIGATE', { action: 'NEXT', duration: 500 }));

    expect(mockMutationFn).not.toHaveBeenCalled();
    expect(mockTrackFunnelComplete).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('mutateOnHomeOnly=true 일 때 HOME 액션은 정상 처리된다', () => {
    const handler = renderHandler(true);
    handler(createMockEvent('NAVIGATE', { action: 'HOME', duration: 1000 }));

    expect(mockMutationFn).toHaveBeenCalled();
    expect(mockTrackFunnelComplete).toHaveBeenCalledWith('test_key', 1000);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
