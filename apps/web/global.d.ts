import { UserTextToken } from '@/features/act/detach';
import { DiaryResult } from '@/features/act/diary/types';
import { WindowLearningData } from '@/features/learning';

export {};

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    diaryResult: DiaryResult[];
    detachResult: UserTextToken[];
    embraceResult: number;
    actionResult: {
      selectedValue: string;
      selectedDomain: string;
      orientation: string;
      obstacle: string;
      action: string;
    };
    topInsets: number;
    insets: { top: number; bottom: number };
    learningData: WindowLearningData;
  }
}
