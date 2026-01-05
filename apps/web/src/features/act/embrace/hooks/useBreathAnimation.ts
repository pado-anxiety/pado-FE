import { useState } from 'react';

import {
  MotionValue,
  animate,
  useMotionValue,
  useTransform,
} from 'motion/react';

import {
  ANIMATION_VALUES,
  BREATH_TEXTS,
  BREATH_TIMING,
  WAVE_MOVEMENT,
} from '../constants';

const BaseYValue = window.innerHeight * ANIMATION_VALUES.BASE_Y_RATIO;

export function useBreathAnimation() {
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

  const runTimer = async (seconds: number, text: string) => {
    setBreathText(text);
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
        runTimer(BREATH_TIMING.INHALE_DURATION, BREATH_TEXTS.INHALE),
      ]);
      await inhaleAnim;

      await runTimer(BREATH_TIMING.HOLD_DURATION, BREATH_TEXTS.HOLD);

      const exhaleAnim = Promise.all([
        animate(baseYValue, currentY - inhaleRise + exhaleDrop, {
          duration: BREATH_TIMING.EXHALE_DURATION,
          ease: 'easeInOut',
        }),
        animate(breathProgress, 0, {
          duration: BREATH_TIMING.EXHALE_DURATION,
          ease: 'easeInOut',
        }),
        runTimer(BREATH_TIMING.EXHALE_DURATION, BREATH_TEXTS.EXHALE),
      ]);
      await exhaleAnim;
    }

    setTimer(0);
    await animate(baseYValue, ANIMATION_VALUES.FINAL_Y_VALUE, {
      duration: BREATH_TIMING.FINAL_ANIMATION_DURATION,
      ease: 'easeInOut',
    });
    setBreathText(BREATH_TEXTS.COMPLETED);
    setSessionCount((prev) => prev + 1);
    setIsCompleted(true);
  };

  const handleRestart = async () => {
    setIsCompleted(false);
    setBreathText(BREATH_TEXTS.RESTART);
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
