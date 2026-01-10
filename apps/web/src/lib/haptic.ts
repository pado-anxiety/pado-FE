import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from './webview';

export type HapticType = 'NAVIGATE' | 'EFFECT' | 'SELECT';

export const triggerHaptic = (type: HapticType = 'SELECT') => {
  try {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.HAPTIC, { type });
  } catch {
    // 웹뷰 환경이 아닌 경우 무시
  }
};
