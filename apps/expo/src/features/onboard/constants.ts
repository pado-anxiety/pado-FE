import type { FunnelStep } from '@src/hooks/useFunnel';

import type { OnboardContext, OnboardStepId, OnboardStepMeta } from './types';

/**
 * 온보딩 스텝 정의
 * 각 스텝의 ID와 메타데이터를 선언적으로 정의
 */
export const ONBOARD_STEPS: readonly FunnelStep<
  OnboardContext,
  OnboardStepId
>[] = [
  {
    id: 'question1' satisfies OnboardStepId,
    meta: { type: 'text', i18nKey: 'onboard.steps.step1' } satisfies OnboardStepMeta,
  },
  {
    id: 'question2' satisfies OnboardStepId,
    meta: { type: 'text', i18nKey: 'onboard.steps.step2' } satisfies OnboardStepMeta,
  },
  {
    id: 'reframe' satisfies OnboardStepId,
    meta: { type: 'text', i18nKey: 'onboard.steps.step3' } satisfies OnboardStepMeta,
  },
  {
    id: 'balance' satisfies OnboardStepId,
    meta: { type: 'text', i18nKey: 'onboard.steps.step4' } satisfies OnboardStepMeta,
  },
  {
    id: 'cta' satisfies OnboardStepId,
    meta: {
      type: 'final',
      i18nKey: 'onboard.steps.step5',
    } satisfies OnboardStepMeta,
  },
] as const;

/**
 * 애니메이션 타이밍 상수
 */
export const ANIMATION = {
  /** 텍스트 페이드인 지속시간 (ms) */
  TEXT_FADE_IN: 500,
  /** 텍스트 간 딜레이 (ms) */
  TEXT_DELAY: 500,
  /** 버튼 표시 딜레이 배율 */
  BUTTON_DELAY_MULTIPLIER: 500,
  /** 스텝 전환 페이드아웃 (ms) */
  STEP_FADE_OUT: 400,
} as const;
