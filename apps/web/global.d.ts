import { UserTextToken } from '@/features/detach';
import { DiaryResult } from '@/features/diary/types';

export {};

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    diaryResult: {
      data: DiaryResult[];
    };
    detachResult: {
      data: UserTextToken[];
    };
  }
}
