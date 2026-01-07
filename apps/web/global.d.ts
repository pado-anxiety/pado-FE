import { UserTextToken } from '@/features/act/detach';
import { DiaryResult } from '@/features/act/diary/types';

export {};

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    diaryResult: DiaryResult[];
    detachResult: UserTextToken[];
    embraceResult: number;
    topInsets: number;
    insets: { top: number; bottom: number };
  }
}
