import { scale } from 'react-native-size-matters';

export const WAVE_LAYOUT = {
  SKY_HEIGHT: scale(300),
  HORIZON_HEIGHT: scale(300),
} as const;

export const FOREGROUND = {
  SPEED_MULTIPLIER: 1,
  FREQUENCY: 2,
  AMPLITUDE: scale(15),
  OFFSET: 0,
} as const;

export const FOREGROUND_MID = {
  SPEED_MULTIPLIER: 0.5,
  FREQUENCY: 2,
  AMPLITUDE: scale(15),
  OFFSET: -scale(25),
} as const;

export const MIDGROUND = {
  SPEED_MULTIPLIER: 0.8,
  FREQUENCY: 2,
  AMPLITUDE: scale(15),
  OFFSET: -scale(50),
} as const;

export const MIDGROUND_BACK = {
  SPEED_MULTIPLIER: 0.3,
  FREQUENCY: 2,
  AMPLITUDE: scale(15),
  OFFSET: -scale(75),
} as const;

export const BACKGROUND = {
  SPEED_MULTIPLIER: 0.7,
  FREQUENCY: 2,
  AMPLITUDE: scale(15),
  OFFSET: -scale(100),
} as const;
