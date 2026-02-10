import { useCallback, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { triggerHaptic } from '@src/lib/haptics';

import {
  BREATH_TEXT_KEYS,
  BREATH_TIMING,
  HAPTIC_INTERVAL,
  SECONDS_PER_SESSION,
} from '../constants';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useBreathAnimation() {
  const { t } = useTranslation();
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [breathText, setBreathText] = useState('');
  const [timer, setTimer] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  // Shared value for wave animation (0 = exhale, 1 = inhale)
  const breathProgress = useSharedValue(0);
  // Shared value for wave base Y position (1 = bottom, 0 = top)
  const waveBaseY = useSharedValue(0.9);

  const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef(false);

  const startHapticLoop = useCallback(() => {
    triggerHaptic('EFFECT');
    hapticIntervalRef.current = setInterval(() => {
      triggerHaptic('EFFECT');
    }, HAPTIC_INTERVAL);
  }, []);

  const stopHapticLoop = useCallback(() => {
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
  }, []);

  const runTimer = useCallback(
    async (seconds: number, textKey: string) => {
      setBreathText(t(textKey));
      for (let i = seconds; i > 0; i--) {
        if (abortRef.current) return;
        setTimer(i);
        await delay(1000);
      }
    },
    [t],
  );

  const animateValue = useCallback(
    (sv: { value: number }, target: number, duration: number) => {
      return new Promise<void>((resolve) => {
        sv.value = withTiming(target, {
          duration: duration * 1000,
          easing: Easing.inOut(Easing.ease),
        });
        setTimeout(resolve, duration * 1000);
      });
    },
    [],
  );

  const handleStartClick = useCallback(async () => {
    abortRef.current = false;
    setIsStarted(true);
    setIsCompleted(false);
    startHapticLoop();

    const startY = 0.9;
    waveBaseY.value = startY;

    const risePerCycle = startY / BREATH_TIMING.CYCLE_COUNT;
    const inhaleRise = risePerCycle * 1.7;
    const exhaleDrop = risePerCycle * 1;

    for (let i = 0; i < BREATH_TIMING.CYCLE_COUNT; i++) {
      if (abortRef.current) break;

      const currentY = i === 0 ? startY : startY - i * risePerCycle * 0.7;

      // Inhale
      await Promise.all([
        animateValue(waveBaseY, currentY - inhaleRise, BREATH_TIMING.INHALE_DURATION),
        animateValue(breathProgress, 1, BREATH_TIMING.INHALE_DURATION),
        runTimer(BREATH_TIMING.INHALE_DURATION, BREATH_TEXT_KEYS.INHALE),
      ]);

      if (abortRef.current) break;

      // Hold
      await runTimer(BREATH_TIMING.HOLD_DURATION, BREATH_TEXT_KEYS.HOLD);

      if (abortRef.current) break;

      // Exhale
      await Promise.all([
        animateValue(
          waveBaseY,
          currentY - inhaleRise + exhaleDrop,
          BREATH_TIMING.EXHALE_DURATION,
        ),
        animateValue(breathProgress, 0, BREATH_TIMING.EXHALE_DURATION),
        runTimer(BREATH_TIMING.EXHALE_DURATION, BREATH_TEXT_KEYS.EXHALE),
      ]);
    }

    if (abortRef.current) return;

    stopHapticLoop();
    setTimer(0);

    // Final animation: waves rise off screen
    await animateValue(waveBaseY, -0.3, 4);

    setBreathText(t(BREATH_TEXT_KEYS.COMPLETED));
    setSessionCount((prev) => prev + 1);
    setIsCompleted(true);
  }, [
    startHapticLoop,
    stopHapticLoop,
    waveBaseY,
    breathProgress,
    animateValue,
    runTimer,
    t,
  ]);

  const handleRestart = useCallback(async () => {
    stopHapticLoop();
    setIsCompleted(false);
    setBreathText(t(BREATH_TEXT_KEYS.RESTART));
    setTimer(0);
    breathProgress.value = 0;

    // Animate waves back down
    await animateValue(waveBaseY, 0.9, 3);

    handleStartClick();
  }, [stopHapticLoop, breathProgress, waveBaseY, animateValue, handleStartClick, t]);

  const getTotalBreathingTime = useCallback(() => {
    return SECONDS_PER_SESSION * sessionCount;
  }, [sessionCount]);

  return {
    isStarted,
    isCompleted,
    breathText,
    timer,
    sessionCount,
    breathProgress,
    waveBaseY,
    handleStartClick,
    handleRestart,
    getTotalBreathingTime,
  };
}
