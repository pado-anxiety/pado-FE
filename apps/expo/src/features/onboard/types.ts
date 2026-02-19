/**
 * 온보딩 스텝 ID
 */
export type OnboardStepId =
  | 'philosophy1'
  | 'philosophy2'
  | 'value'
  | 'breathing'
  | 'complete';

/**
 * 온보딩 컨텍스트 (데이터 수집 없음)
 */
export type OnboardContext = Record<string, never>;

/**
 * 온보딩 스텝 메타데이터
 */
export interface OnboardStepMeta {
  /** i18n 키 (예: 'onboard.steps.step1') */
  i18nKey: string;
  /** 호흡 스텝 여부 */
  isBreathingStep?: boolean;
  /** 마지막 스텝 여부 (로그인 이동) */
  isFinalStep?: boolean;
}

/**
 * 스텝 컨텐츠 데이터
 */
export interface StepContentData {
  texts: string[];
  buttonText: string;
}
