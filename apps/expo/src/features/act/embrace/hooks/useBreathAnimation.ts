import { useCallback, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { triggerHaptic } from '@src/lib/haptics';

import {
  BREATH_TEXT_KEYS,
  BREATH_TIMING,
  HAPTIC_INTERVAL,
  SECONDS_PER_SESSION,
} from '../constants';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const BREATH_WAVE_PARAMS = {
  /** 파도 초기 Y 위치 (아래쪽) */
  INITIAL_BASE_Y: 0.55,
  /** 호흡 시작 시 파도 Y 위치 */
  START_Y: 0.9,
  /** 흡입 시 상승 비율 (1 사이클 이동량 대비) */
  INHALE_RISE_RATIO: 1.2,
  /** 호기 시 하강 비율 (1 사이클 이동량 대비) */
  EXHALE_DROP_RATIO: 0.5,
  /** 사이클별 Y 감소 비율 */
  CYCLE_DECAY_RATIO: 0.7,
  /** 호흡 시작 준비 애니메이션 duration (초) */
  PREPARE_DURATION: 2,
  /** 완료 후 파도 퇴장 Y 위치 */
  EXIT_Y: -0.3,
  /** 완료 후 파도 퇴장 duration (초) */
  EXIT_DURATION: 4,
  /** 재시작 시 파도 복귀 duration (초) */
  RESTART_DURATION: 3,
};

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
  const waveBaseY = useSharedValue(BREATH_WAVE_PARAMS.INITIAL_BASE_Y);

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

  const startBreathingSession = useCallback(async () => {
    abortRef.current = false;
    setIsStarted(true);
    setIsCompleted(false);

    const { START_Y, INHALE_RISE_RATIO, EXHALE_DROP_RATIO, CYCLE_DECAY_RATIO, PREPARE_DURATION, EXIT_Y, EXIT_DURATION } = BREATH_WAVE_PARAMS;

    // 파도를 아래로 내린 뒤 호흡 시작
    await animateValue(waveBaseY, START_Y, PREPARE_DURATION);

    startHapticLoop();

    waveBaseY.value = START_Y;

    const risePerCycle = START_Y / BREATH_TIMING.CYCLE_COUNT;
    const inhaleRise = risePerCycle * INHALE_RISE_RATIO;
    const exhaleDrop = risePerCycle * EXHALE_DROP_RATIO;

    for (let i = 0; i < BREATH_TIMING.CYCLE_COUNT; i++) {
      if (abortRef.current) break;

      const currentY = i === 0 ? START_Y : START_Y - i * risePerCycle * CYCLE_DECAY_RATIO;

      // Inhale
      await Promise.all([
        animateValue(
          waveBaseY,
          currentY - inhaleRise,
          BREATH_TIMING.INHALE_DURATION,
        ),
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
    await animateValue(waveBaseY, EXIT_Y, EXIT_DURATION);

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
    await animateValue(waveBaseY, BREATH_WAVE_PARAMS.START_Y, BREATH_WAVE_PARAMS.RESTART_DURATION);

    startBreathingSession();
  }, [
    stopHapticLoop,
    breathProgress,
    waveBaseY,
    animateValue,
    startBreathingSession,
    t,
  ]);

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
    startBreathingSession,
    /** @deprecated Use startBreathingSession instead */
    handleStartClick: startBreathingSession,
    handleRestart,
    getTotalBreathingTime,
  };
}
