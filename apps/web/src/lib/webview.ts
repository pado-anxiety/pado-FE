import {
  WebViewMessage,
  WebViewMessagePayload,
  WebViewMessageType,
} from '@pado/bridge';

export const handlePostMessage = <T extends WebViewMessageType>(
  type: T,
  data: WebViewMessagePayload[T],
) => {
  const isNativeWebView =
    typeof window !== 'undefined' && !!window.ReactNativeWebView;

  if (!isNativeWebView) {
    throw new Error(`${type} 메시지를 전송할 수 없습니다.`);
  }

  try {
    const message: WebViewMessage<T> = { type, data };

    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } catch (error) {
    console.error(`[Bridge Error] 메시지 전송 중 오류 발생:`, error);
  }
};
