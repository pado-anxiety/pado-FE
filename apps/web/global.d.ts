import { UserTextToken } from '@/features/act/detach';
import { DiaryResult } from '@/features/act/diary/types';
import { EmbraceResult } from '@/features/act/embrace/types';

export {};

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    diaryResult: DiaryResult[];
    detachResult: UserTextToken[];
    embraceResult: EmbraceResult;
  }
}
