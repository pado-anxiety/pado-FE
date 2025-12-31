import { Platform } from 'react-native';

import { ENV } from '../env';

export const WEBVIEW_ROUTES = {
  ACT: {
    ANCHOR: {
      BASE: '/act/anchor',
      STEP: '/act/anchor/step',
      RESULT: '/act/anchor/result',
    },
    DIARY: {
      BASE: '/act/diary',
      STEP: '/act/diary/step',
      RESULT: '/act/diary/result',
    },
  },
} as const;

export const getWebViewBaseURL = () => {
  if (Platform.OS === 'ios') {
    return ENV.IOS_WEBVIEW_URL;
  }
  return ENV.ANDROID_WEBVIEW_URL;
};
