import { WebViewMessageEvent } from 'react-native-webview';

import {
  HapticType,
  NavigateAction,
  WEBVIEW_MESSAGE_TYPE,
} from '@pado/bridge';

import { triggerHaptic } from './haptics';
import { parseJSON } from './json/parse-json';

/**
 * 웹뷰에서 온 메시지를 파싱하고, HAPTIC 메시지는 자동으로 처리합니다.
 * 다른 메시지 타입은 콜백으로 전달됩니다.
 */
export const createWebViewMessageHandler = (
  handlers: {
    onNavigate?: (
      action: NavigateAction,
      duration: number,
      step?: number,
    ) => void;
    onComplete?: (data: unknown) => void;
    onError?: (error: string) => void;
    onValidate?: (title: string, message: string) => void;
  } = {},
) => {
  return (event: WebViewMessageEvent) => {
    const parsedData = parseJSON(event.nativeEvent.data, () => {});
    if (parsedData.errorMessage) return;

    const { type, data } = parsedData;

    // HAPTIC 메시지는 자동으로 처리
    if (type === WEBVIEW_MESSAGE_TYPE.HAPTIC) {
      const hapticType = data?.type as HapticType | undefined;
      triggerHaptic(hapticType || 'SELECT');
      return;
    }

    // 다른 메시지 타입은 핸들러로 전달
    if (type === WEBVIEW_MESSAGE_TYPE.NAVIGATE && handlers.onNavigate) {
      handlers.onNavigate(data.action, data.duration, data.step);
    } else if (type === WEBVIEW_MESSAGE_TYPE.COMPLETE && handlers.onComplete) {
      handlers.onComplete(data);
    } else if (type === WEBVIEW_MESSAGE_TYPE.ERROR && handlers.onError) {
      handlers.onError(data.error);
    } else if (type === WEBVIEW_MESSAGE_TYPE.VALIDATE && handlers.onValidate) {
      handlers.onValidate(data.title, data.message);
    }
  };
};
