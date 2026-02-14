import type { FunnelStep } from '@src/hooks/useFunnel';

import type { EmbraceContext, EmbraceStepId, EmbraceStepMeta } from './types';

export const EMBRACE_STEPS: readonly FunnelStep<
  EmbraceContext,
  EmbraceStepId
>[] = [
  {
    id: 'intro' satisfies EmbraceStepId,
    meta: { type: 'intro' } satisfies EmbraceStepMeta,
  },
  {
    id: 'step' satisfies EmbraceStepId,
    meta: { type: 'step' } satisfies EmbraceStepMeta,
  },
  {
    id: 'result' satisfies EmbraceStepId,
    meta: { type: 'result' } satisfies EmbraceStepMeta,
  },
] as const;

export const BREATH_TIMING = {
  INHALE_DURATION: 4,
  HOLD_DURATION: 7,
  EXHALE_DURATION: 8,
  CYCLE_COUNT: 4,
} as const;

export const SECONDS_PER_CYCLE =
  BREATH_TIMING.INHALE_DURATION +
  BREATH_TIMING.HOLD_DURATION +
  BREATH_TIMING.EXHALE_DURATION;

export const SECONDS_PER_SESSION =
  SECONDS_PER_CYCLE * BREATH_TIMING.CYCLE_COUNT;

export const BREATH_TEXT_KEYS = {
  INHALE: 'act.embrace.breath.inhale',
  HOLD: 'act.embrace.breath.hold',
  EXHALE: 'act.embrace.breath.exhale',
  COMPLETED: 'act.embrace.breath.completed',
  RESTART: 'act.embrace.breath.restart',
} as const;

export const WAVE_CONFIGS = [
  {
    frequency: 1.8,
    speedMultiplier: 0.4,
    amplitudeScale: 1.0,
    riseSpeed: 0.7,
    offsetRatio: -0.12,
  },
  {
    frequency: 1.6,
    speedMultiplier: 0.6,
    amplitudeScale: 1.0,
    riseSpeed: 0.85,
    offsetRatio: -0.11,
  },
  {
    frequency: 1.5,
    speedMultiplier: 0.8,
    amplitudeScale: 1.0,
    riseSpeed: 1.0,
    offsetRatio: -0.08,
  },
  {
    frequency: 1.4,
    speedMultiplier: 1.1,
    amplitudeScale: 1.0,
    riseSpeed: 1.15,
    offsetRatio: -0.05,
  },
  {
    frequency: 1.3,
    speedMultiplier: 1.4,
    amplitudeScale: 1.0,
    riseSpeed: 1.3,
    offsetRatio: -0.03,
  },
] as const;

export const HAPTIC_INTERVAL = 500;
