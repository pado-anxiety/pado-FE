import { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

const ENTERING_DELAY_MS = 500;
const STAGGER_INTERVAL_MS = 80;
const DURATION_MS = 300;

const EASE_OUT_QUINT = Easing.bezier(0.23, 1, 0.32, 1);
const EASE_OUT_CUBIC = Easing.bezier(0.215, 0.61, 0.355, 1);
const EASE_OUT_QUART = Easing.bezier(0.165, 0.84, 0.44, 1);

export const PAGE_TRANSITION = {
  entering: FadeIn.delay(ENTERING_DELAY_MS)
    .duration(DURATION_MS)
    .easing(EASE_OUT_QUINT),
  exiting: FadeOut.duration(DURATION_MS).easing(EASE_OUT_CUBIC),
  staggeredEntering: (index: number) =>
    FadeIn.delay(ENTERING_DELAY_MS + index * STAGGER_INTERVAL_MS).duration(
      DURATION_MS,
    ),
};

const MODAL_DURATION_MS = 150;

export const MODAL_TRANSITION = {
  entering: FadeIn.duration(MODAL_DURATION_MS).easing(EASE_OUT_QUART),
  exiting: FadeOut.duration(MODAL_DURATION_MS).easing(EASE_OUT_CUBIC),
};
