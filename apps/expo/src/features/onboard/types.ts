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
 * 온보딩 스텝 메타데이터 (discriminated union)
 */
export type OnboardStepMeta =
  | { type: 'text'; i18nKey: string }
  | { type: 'breathing'; i18nKey: string }
  | { type: 'final'; i18nKey: string };

/**
 * 스텝 컨텐츠 데이터
 */
export interface StepContentData {
  texts: string[];
  buttonText: string;
}
