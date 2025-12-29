import { WebViewMessageType } from '@pado/bridge';
import { WebViewMessageEvent } from 'react-native-webview';

export const handleOnMessage = (
  event: WebViewMessageEvent,
  type: WebViewMessageType,
  callback: () => void,
) => {
  const parsedData = JSON.parse(event.nativeEvent.data);
  if (parsedData.type === type) {
    callback();
  }
};
