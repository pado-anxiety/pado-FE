export const STEP_COUNT = 8;

export const FADE_IN_DURATION = 0.6;
export const FADE_OUT_DURATION = 0.4;
export const TEXT_DELAY = 0.6;
export const BUTTON_DELAY = 0.8;

export const BREATH_CYCLE_COUNT = 2;
export const BREATH_TIMING = {
  INHALE: 4,
  HOLD: 7,
  EXHALE: 8,
} as const;

// i18n keys for breath texts
export const BREATH_TEXT_KEYS = {
  INHALE: 'onboard.breath.inhale',
  HOLD: 'onboard.breath.hold',
  EXHALE: 'onboard.breath.exhale',
} as const;

export const WAVE_CONFIG = {
  AMPLITUDE: 25,
  GAP_NORMAL: 35,
  GAP_COMPRESSED: 20,
  BASE_Y_RATIO: 0.2,
  TIME_INCREMENT: 0.015,
  WAVE_STEP: 4,
} as const;

export const WAVE_CONFIGS = [
  {
    color: '#D3F3FF',
    frequency: 1.5,
    speedMultiplier: 1.2,
    offsetRatio: -0.18,
  },
  { color: '#77AADD', frequency: 1.5, speedMultiplier: 1, offsetRatio: -0.15 },
  {
    color: '#3388CC',
    frequency: 1.5,
    speedMultiplier: 0.8,
    offsetRatio: -0.13,
  },
  { color: '#005599', frequency: 1.5, speedMultiplier: 1, offsetRatio: -0.09 },
  {
    color: '#003366',
    frequency: 1.5,
    speedMultiplier: 1.2,
    offsetRatio: -0.05,
  },
] as const;

export const GRADIENT_END_COLOR = '#000814';
export const BREATHING_STEP_INDEX = 6;
