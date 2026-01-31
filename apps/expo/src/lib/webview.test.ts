import { WebViewMessageEvent } from 'react-native-webview';

import { createWebViewMessageHandler } from './webview';

jest.mock('./haptics', () => ({
  triggerHaptic: jest.fn(),
}));

const createMockEvent = (type: string, data: unknown): WebViewMessageEvent =>
  ({
    nativeEvent: {
      data: JSON.stringify({ type, data }),
    },
  }) as WebViewMessageEvent;

describe('createWebViewMessageHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('NAVIGATE 메시지를 onNavigate 핸들러로 전달한다', () => {
    const onNavigate = jest.fn();
    const handler = createWebViewMessageHandler({ onNavigate });

    handler(
      createMockEvent('NAVIGATE', {
        action: 'LOGIN',
        duration: 5000,
        step: 7,
      }),
    );

    expect(onNavigate).toHaveBeenCalledWith('LOGIN', 5000, 7);
  });

  it('COMPLETE 메시지를 onComplete 핸들러로 전달한다', () => {
    const onComplete = jest.fn();
    const handler = createWebViewMessageHandler({ onComplete });

    handler(createMockEvent('COMPLETE', { data: { test: 'value' } }));

    expect(onComplete).toHaveBeenCalledWith({ data: { test: 'value' } });
  });

  it('ERROR 메시지를 onError 핸들러로 전달한다', () => {
    const onError = jest.fn();
    const handler = createWebViewMessageHandler({ onError });

    handler(createMockEvent('ERROR', { error: 'Something went wrong' }));

    expect(onError).toHaveBeenCalledWith('Something went wrong');
  });

  it('VALIDATE 메시지를 onValidate 핸들러로 전달한다', () => {
    const onValidate = jest.fn();
    const handler = createWebViewMessageHandler({ onValidate });

    handler(
      createMockEvent('VALIDATE', { title: 'Title', message: 'Message' }),
    );

    expect(onValidate).toHaveBeenCalledWith('Title', 'Message');
  });

  it('HAPTIC 메시지는 triggerHaptic을 호출한다', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { triggerHaptic } = require('./haptics');
    const handler = createWebViewMessageHandler({});

    handler(createMockEvent('HAPTIC', { type: 'NAVIGATE' }));

    expect(triggerHaptic).toHaveBeenCalledWith('NAVIGATE');
  });
});
