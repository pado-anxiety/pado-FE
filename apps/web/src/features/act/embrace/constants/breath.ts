export const BREATH_TIMING = {
  INHALE_DURATION: 4,
  HOLD_DURATION: 7,
  EXHALE_DURATION: 8,
  CYCLE_COUNT: 1,
  FINAL_ANIMATION_DURATION: 4,
  RESTART_ANIMATION_DURATION: 3,
} as const;

export const ANIMATION_VALUES = {
  AMPLITUDE_MIN: 20,
  AMPLITUDE_MAX: 30,
  GAP_MIN: 5,
  GAP_MAX: 30,
  TIME_INCREMENT: 0.015,
  FINAL_Y_VALUE: -100,
  BASE_Y_RATIO: 0.9,
} as const;

// i18n keys for breath texts
export const BREATH_TEXT_KEYS = {
  INHALE: 'act.embrace.breath.inhale',
  HOLD: 'act.embrace.breath.hold',
  EXHALE: 'act.embrace.breath.exhale',
  COMPLETED: 'act.embrace.breath.completed',
  RESTART: 'act.embrace.breath.restart',
} as const;

export const WAVE_MOVEMENT = {
  INHALE_RISE_MULTIPLIER: 1.7,
  EXHALE_DROP_MULTIPLIER: 1,
} as const;

export const WAVE_CONFIGS = [
  {
    color: '#D3F3FF',
    frequency: 1.5,
    speedMultiplier: 1.2,
    offsetRatio: -0.18,
  },
  {
    color: '#77AADD',
    frequency: 1.5,
    speedMultiplier: 1,
    offsetRatio: -0.15,
  },
  {
    color: '#3388CC',
    frequency: 1.5,
    speedMultiplier: 0.8,
    offsetRatio: -0.13,
  },
  {
    color: '#005599',
    frequency: 1.5,
    speedMultiplier: 1,
    offsetRatio: -0.09,
  },
  {
    color: '#003366',
    frequency: 1.5,
    speedMultiplier: 1.2,
    offsetRatio: -0.05,
  },
] as const;

export const GRADIENT_COLORS = {
  END: '#000814',
} as const;

export const CANVAS_CONFIG = {
  WAVE_STEP: 4,
  TIME_INCREMENT: 0.015,
} as const;

export const TIME_CALCULATION = {
  SECONDS_PER_CYCLE:
    BREATH_TIMING.INHALE_DURATION +
    BREATH_TIMING.HOLD_DURATION +
    BREATH_TIMING.EXHALE_DURATION,
  getSecondsPerSession: () =>
    TIME_CALCULATION.SECONDS_PER_CYCLE * BREATH_TIMING.CYCLE_COUNT,
} as const;
