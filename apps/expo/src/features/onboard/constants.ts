import type { FunnelStep } from '@src/hooks/useFunnel';

import type { OnboardContext, OnboardStepId, OnboardStepMeta } from './types';

/**
 * 온보딩 스텝 정의
 * 각 스텝의 ID와 메타데이터를 선언적으로 정의
 */
export const ONBOARD_STEPS: readonly FunnelStep<OnboardContext>[] = [
  {
    id: 'welcome' satisfies OnboardStepId,
    meta: { i18nKey: 'onboard.steps.step1' } satisfies OnboardStepMeta,
  },
  {
    id: 'needs1' satisfies OnboardStepId,
    meta: { i18nKey: 'onboard.steps.step2' } satisfies OnboardStepMeta,
  },
  {
    id: 'needs2' satisfies OnboardStepId,
    meta: { i18nKey: 'onboard.steps.step3' } satisfies OnboardStepMeta,
  },
  {
    id: 'actTheory' satisfies OnboardStepId,
    meta: { i18nKey: 'onboard.steps.step4' } satisfies OnboardStepMeta,
  },
  {
    id: 'metaphor' satisfies OnboardStepId,
    meta: { i18nKey: 'onboard.steps.step5' } satisfies OnboardStepMeta,
  },
  {
    id: 'startGuide' satisfies OnboardStepId,
    meta: { i18nKey: 'onboard.steps.step6' } satisfies OnboardStepMeta,
  },
  {
    id: 'breathing' satisfies OnboardStepId,
    meta: {
      i18nKey: 'onboard.steps.step7',
      isBreathingStep: true,
    } satisfies OnboardStepMeta,
  },
  {
    id: 'complete' satisfies OnboardStepId,
    meta: {
      i18nKey: 'onboard.steps.step8',
      isFinalStep: true,
    } satisfies OnboardStepMeta,
  },
] as const;

/**
 * 애니메이션 타이밍 상수
 */
export const ANIMATION = {
  /** 텍스트 페이드인 지속시간 (ms) */
  TEXT_FADE_IN: 600,
  /** 텍스트 간 딜레이 (ms) */
  TEXT_DELAY: 600,
  /** 버튼 표시 딜레이 배율 */
  BUTTON_DELAY_MULTIPLIER: 100,
  /** 스텝 전환 페이드아웃 (ms) */
  STEP_FADE_OUT: 400,
} as const;

/**
 * 호흡 타이밍 상수
 */
export const BREATH = {
  /** 들이쉬기 (초) */
  INHALE: 4,
  /** 참기 (초) */
  HOLD: 7,
  /** 내쉬기 (초) */
  EXHALE: 8,
  /** 반복 횟수 */
  CYCLE_COUNT: 2,
  /** 햅틱 간격 (ms) */
  HAPTIC_INTERVAL: 500,
} as const;
