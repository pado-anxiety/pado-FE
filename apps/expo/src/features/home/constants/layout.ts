import { scale } from 'react-native-size-matters';

export const WAVE_LAYOUT = {
  SKY_HEIGHT: scale(300),
  HORIZON_HEIGHT: scale(180),
} as const;

export const FOREGROUND = {
  SPEED_MULTIPLIER: 1,
  FREQUENCY: 1.5,
  AMPLITUDE: scale(28),
  OFFSET: 0,
} as const;

export const FOREGROUND_MID = {
  SPEED_MULTIPLIER: 0.8,
  FREQUENCY: 1.8,
  AMPLITUDE: scale(22),
  OFFSET: -scale(30),
} as const;

export const MIDGROUND = {
  SPEED_MULTIPLIER: 0.6,
  FREQUENCY: 2.2,
  AMPLITUDE: scale(16),
  OFFSET: -scale(55),
} as const;

export const MIDGROUND_BACK = {
  SPEED_MULTIPLIER: 0.4,
  FREQUENCY: 2.8,
  AMPLITUDE: scale(11),
  OFFSET: -scale(75),
} as const;

export const BACKGROUND = {
  SPEED_MULTIPLIER: 0.3,
  FREQUENCY: 3.5,
  AMPLITUDE: scale(8),
  OFFSET: -scale(90),
} as const;
