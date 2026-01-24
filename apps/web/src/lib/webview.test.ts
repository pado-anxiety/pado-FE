import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from './webview';

describe('handlePostMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ReactNativeWebView가 없으면 에러를 던진다', () => {
    // @ts-expect-error - 테스트를 위해 undefined로 설정
    window.ReactNativeWebView = undefined;

    expect(() =>
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
        action: 'NEXT',
        step: 0,
        duration: 1000,
      }),
    ).toThrow('NAVIGATE 메시지를 전송할 수 없습니다.');
  });

  it('NAVIGATE 메시지를 올바른 형식으로 전송한다', () => {
    const mockPostMessage = vi.fn();
    window.ReactNativeWebView = { postMessage: mockPostMessage };

    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
      step: 0,
      duration: 1000,
    });

    expect(mockPostMessage).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'NAVIGATE',
        data: { action: 'NEXT', step: 0, duration: 1000 },
      }),
    );
  });
});
