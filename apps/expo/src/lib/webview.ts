import { WebViewMessageType } from '@pado/bridge';
import { WebViewMessageEvent } from 'react-native-webview';

export const handleOnMessage = <T>(
  event: WebViewMessageEvent,
  type: WebViewMessageType,
  callback: (data?: T) => void,
) => {
  const parsedData = JSON.parse(event.nativeEvent.data);
  if (parsedData.type === type) {
    callback(parsedData.data);
  }
};
