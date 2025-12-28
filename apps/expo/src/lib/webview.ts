import { Platform } from 'react-native';

import { ENV } from './env';

export const getWebViewURL = () => {
  if (Platform.OS === 'ios') {
    return ENV.IOS_WEBVIEW_URL;
  }
  return ENV.ANDROID_WEBVIEW_URL;
};
