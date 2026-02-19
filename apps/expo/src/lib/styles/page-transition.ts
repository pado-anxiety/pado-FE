import { FadeIn, FadeOut } from 'react-native-reanimated';

const ENTERING_DELAY_MS = 500;
const STAGGER_INTERVAL_MS = 80;
const DURATION_MS = 300;

export const PAGE_TRANSITION = {
  entering: FadeIn.delay(ENTERING_DELAY_MS).duration(DURATION_MS),
  exiting: FadeOut.duration(DURATION_MS),
  staggeredEntering: (index: number) =>
    FadeIn.delay(ENTERING_DELAY_MS + index * STAGGER_INTERVAL_MS).duration(
      DURATION_MS,
    ),
};

const MODAL_DURATION_MS = 150;

export const MODAL_TRANSITION = {
  entering: FadeIn.duration(MODAL_DURATION_MS),
  exiting: FadeOut.duration(MODAL_DURATION_MS),
};
