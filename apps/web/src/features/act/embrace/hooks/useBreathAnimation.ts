import { useState } from 'react';

import {
  MotionValue,
  animate,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { useTranslation } from 'react-i18next';

import {
  ANIMATION_VALUES,
  BREATH_TEXT_KEYS,
  BREATH_TIMING,
  WAVE_MOVEMENT,
} from '../constants';

const BaseYValue = window.innerHeight * ANIMATION_VALUES.BASE_Y_RATIO;

export function useBreathAnimation() {
  const { t } = useTranslation();
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [breathText, setBreathText] = useState('');
  const [timer, setTimer] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const breathProgress = useMotionValue(0);
  const baseYValue = useMotionValue(BaseYValue);

  const amplitude = useTransform(
    breathProgress,
    [0, 1],
    [ANIMATION_VALUES.AMPLITUDE_MIN, ANIMATION_VALUES.AMPLITUDE_MAX],
  ) as MotionValue<number>;
  const gap = useTransform(
    breathProgress,
    [0, 1],
    [ANIMATION_VALUES.GAP_MIN, ANIMATION_VALUES.GAP_MAX],
  ) as MotionValue<number>;

  const runTimer = async (seconds: number, textKey: string) => {
    setBreathText(t(textKey));
    setTimer(seconds);
    for (let i = seconds; i > 0; i--) {
      setTimer(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleStartClick = async () => {
    setIsStarted(true);

    const startY = BaseYValue;
    baseYValue.set(startY);

    const risePerCycle = startY / BREATH_TIMING.CYCLE_COUNT;
    const inhaleRise = risePerCycle * WAVE_MOVEMENT.INHALE_RISE_MULTIPLIER;
    const exhaleDrop = risePerCycle * WAVE_MOVEMENT.EXHALE_DROP_MULTIPLIER;

    for (let i = 0; i < BREATH_TIMING.CYCLE_COUNT; i++) {
      const currentY = baseYValue.get();

      const inhaleAnim = Promise.all([
        animate(baseYValue, currentY - inhaleRise, {
          duration: BREATH_TIMING.INHALE_DURATION,
          ease: 'easeInOut',
        }),
        animate(breathProgress, 1, {
          duration: BREATH_TIMING.INHALE_DURATION,
          ease: 'easeInOut',
        }),
        runTimer(BREATH_TIMING.INHALE_DURATION, BREATH_TEXT_KEYS.INHALE),
      ]);
      await inhaleAnim;

      await runTimer(BREATH_TIMING.HOLD_DURATION, BREATH_TEXT_KEYS.HOLD);

      const exhaleAnim = Promise.all([
        animate(baseYValue, currentY - inhaleRise + exhaleDrop, {
          duration: BREATH_TIMING.EXHALE_DURATION,
          ease: 'easeInOut',
        }),
        animate(breathProgress, 0, {
          duration: BREATH_TIMING.EXHALE_DURATION,
          ease: 'easeInOut',
        }),
        runTimer(BREATH_TIMING.EXHALE_DURATION, BREATH_TEXT_KEYS.EXHALE),
      ]);
      await exhaleAnim;
    }

    setTimer(0);
    await animate(baseYValue, ANIMATION_VALUES.FINAL_Y_VALUE, {
      duration: BREATH_TIMING.FINAL_ANIMATION_DURATION,
      ease: 'easeInOut',
    });
    setBreathText(t(BREATH_TEXT_KEYS.COMPLETED));
    setSessionCount((prev) => prev + 1);
    setIsCompleted(true);
  };

  const handleRestart = async () => {
    setIsCompleted(false);
    setBreathText(t(BREATH_TEXT_KEYS.RESTART));
    setTimer(0);
    breathProgress.set(0);
    await animate(baseYValue, BaseYValue, {
      duration: BREATH_TIMING.RESTART_ANIMATION_DURATION,
      ease: 'easeInOut',
    });
    handleStartClick();
  };

  return {
    isStarted,
    isCompleted,
    breathText,
    timer,
    sessionCount,
    breathProgress,
    baseYValue,
    amplitude,
    gap,
    handleStartClick,
    handleRestart,
  };
}
