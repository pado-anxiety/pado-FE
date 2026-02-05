import type { Value } from '@/features/act/action/hooks/useActionStep';
import type { UserTextToken } from '@/features/act/detach/types';
import type { WindowLearningData } from '@/features/learning';

/**
 * Action 결과 데이터 타입
 */
export interface ActionResult {
  selectedValue: Value;
  selectedDomain: keyof Value;
  orientation: string;
  obstacle: string;
  action: string;
}

declare global {
  interface Window {
    /** Detach 결과: 사용자가 선택한 텍스트 토큰 배열 */
    detachResult?: UserTextToken[];

    /** Action 결과: 가치 선택 및 행동 계획 */
    actionResult?: ActionResult;

    /** Diary 결과: JSON 문자열 (DiaryResult[] 파싱 필요) */
    diaryResult?: string;

    /** Embrace 결과: 호흡 시간 (초 단위) */
    embraceResult?: number;

    /** Safe area top inset 값 */
    topInsets?: number;

    /** Safe area insets */
    insets?: { top: number; bottom: number };

    /** Learning 데이터 */
    learningData?: WindowLearningData;

    /** React Native WebView 브릿지 */
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export {};
