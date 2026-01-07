import { Platform } from 'react-native';

import { ENV } from '../env';

export const WEBVIEW_ROUTES = {
  ONBOARD: '/onboard',
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
    DETACH: {
      BASE: '/act/detach',
      STEP: '/act/detach/step',
      RESULT: '/act/detach/result',
    },
    EMBRACE: {
      BASE: '/act/embrace',
      STEP: '/act/embrace/step',
      RESULT: '/act/embrace/result',
    },
  },
} as const;

export const getWebViewBaseURL = () => {
  const baseURL =
    Platform.OS === 'ios' ? ENV.IOS_WEBVIEW_URL : ENV.ANDROID_WEBVIEW_URL;
  return baseURL.replace(/\/$/, '');
};
