import * as Haptics from 'expo-haptics';

import { storage } from './store';

const HAPTIC_STATE_KEY = 'haptics_state';

export type HapticType = 'NAVIGATE' | 'EFFECT' | 'SELECT';

export const getHapticState = () => {
  const state = storage.getBoolean(HAPTIC_STATE_KEY);

  if (state === undefined) {
    setHapticState(true);
    return true;
  }

  return state;
};

export const setHapticState = (state: boolean) => {
  storage.set(HAPTIC_STATE_KEY, state);
};

const hapticMap: Record<HapticType, () => void> = {
  NAVIGATE: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  EFFECT: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  SELECT: () => Haptics.selectionAsync(),
};

export const triggerHaptic = (type: HapticType = 'SELECT'): void => {
  if (!getHapticState()) {
    return;
  }

  const action = hapticMap[type] || hapticMap.SELECT;
  action();
};
