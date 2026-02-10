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
    color: '#D3F3FF',
    frequency: 1.5,
    speedMultiplier: 1.4,
    riseSpeed: 0.7,
    offsetRatio: -0.18,
  },
  {
    color: '#77AADD',
    frequency: 1.5,
    speedMultiplier: 1.1,
    riseSpeed: 0.85,
    offsetRatio: -0.15,
  },
  {
    color: '#3388CC',
    frequency: 1.5,
    speedMultiplier: 0.8,
    riseSpeed: 1.0,
    offsetRatio: -0.13,
  },
  {
    color: '#005599',
    frequency: 1.5,
    speedMultiplier: 0.6,
    riseSpeed: 1.15,
    offsetRatio: -0.09,
  },
  {
    color: '#003366',
    frequency: 1.5,
    speedMultiplier: 0.4,
    riseSpeed: 1.3,
    offsetRatio: -0.05,
  },
] as const;

export const HAPTIC_INTERVAL = 500;
