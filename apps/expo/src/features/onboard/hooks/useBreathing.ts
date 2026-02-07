import { useCallback, useRef, useState } from 'react';

import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import {
  Easing,
  SharedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { BREATH } from '../constants';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 파도 오프셋 상수 (translateY)
 * 음수 = 파도가 위로 이동 = 수평선 상승
 * 양수 = 파도가 아래로 이동 = 수평선 하강
 */
const WAVE_OFFSET = {
  /** 기본 위치 */
  NORMAL: 0,
  /** 들숨 시 - 파도 수평선이 올라감 (파도가 위로) */
  INHALE: -20,
  /** 날숨 시 - 파도 수평선이 내려감 (파도가 아래로) */
  EXHALE: 400,
} as const;

/**
 * 파도 간격 스케일 상수 (웹 버전 참고)
 * 1.0 = 기본 간격
 * > 1.0 = 간격 확대 (파도가 올라갈 때)
 * < 1.0 = 간격 축소 (파도가 내려갈 때)
 */
const WAVE_GAP_SCALE = {
  /** 기본 간격 */
  NORMAL: 1.0,
  /** 들숨 시 - 파도가 올라가면서 간격 확대 */
  INHALE: 1.4,
  /** 날숨 시 - 파도가 내려가면서 간격 축소 */
  EXHALE: 0.7,
} as const;

interface UseBreathingReturn {
  isBreathing: boolean;
  breathText: string;
  breathTimer: number;
  /** 파도 오프셋 값 (translateY에 사용) */
  waveOffset: SharedValue<number>;
  /** 파도 간격 스케일 값 (수평선 간 거리 조절) */
  waveGapScale: SharedValue<number>;
  startBreathing: () => Promise<boolean>;
}

/**
 * 호흡 운동 훅
 * 들이쉬기(4초) → 참기(7초) → 내쉬기(8초) 사이클을 관리
 * 파도 오프셋/간격 애니메이션도 함께 제어
 */
export function useBreathing(): UseBreathingReturn {
  const { t } = useTranslation();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('');
  const [breathTimer, setBreathTimer] = useState(0);
  const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 파도 오프셋 SharedValue
  const waveOffset = useSharedValue<number>(WAVE_OFFSET.NORMAL);
  // 파도 간격 스케일 SharedValue
  const waveGapScale = useSharedValue<number>(WAVE_GAP_SCALE.NORMAL);

  const startHapticLoop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    hapticIntervalRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, BREATH.HAPTIC_INTERVAL);
  }, []);

  const stopHapticLoop = useCallback(() => {
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
  }, []);

  const runBreathCycle = useCallback(async () => {
    // 들이쉬기 - 파도 수평선 올라감, 간격 확대
    setBreathText(t('onboard.breath.inhale'));
    waveOffset.value = withTiming(WAVE_OFFSET.INHALE, {
      duration: BREATH.INHALE * 1000,
      easing: Easing.inOut(Easing.ease),
    });
    waveGapScale.value = withTiming(WAVE_GAP_SCALE.INHALE, {
      duration: BREATH.INHALE * 1000,
      easing: Easing.inOut(Easing.ease),
    });

    for (let i = BREATH.INHALE; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }

    // 참기 - 유지
    setBreathText(t('onboard.breath.hold'));
    for (let i = BREATH.HOLD; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }

    // 내쉬기 - 파도 수평선 내려감, 간격 축소
    setBreathText(t('onboard.breath.exhale'));
    waveOffset.value = withTiming(WAVE_OFFSET.EXHALE, {
      duration: BREATH.EXHALE * 1000,
      easing: Easing.inOut(Easing.ease),
    });
    waveGapScale.value = withTiming(WAVE_GAP_SCALE.EXHALE, {
      duration: BREATH.EXHALE * 1000,
      easing: Easing.inOut(Easing.ease),
    });

    for (let i = BREATH.EXHALE; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }
  }, [t, waveOffset, waveGapScale]);

  const startBreathing = useCallback(async (): Promise<boolean> => {
    setIsBreathing(true);

    // 준비 - 파도 수평선 내려감, 간격 축소
    waveOffset.value = withTiming(WAVE_OFFSET.EXHALE, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });
    waveGapScale.value = withTiming(WAVE_GAP_SCALE.EXHALE, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });
    await wait(1500);

    startHapticLoop();

    // 호흡 사이클 실행
    for (let i = 0; i < BREATH.CYCLE_COUNT; i++) {
      await runBreathCycle();
    }

    stopHapticLoop();

    // 완료 메시지
    setBreathText(t('act.embrace.breath.completed'));
    setBreathTimer(0);

    // 원래 위치로 복귀
    waveOffset.value = withTiming(WAVE_OFFSET.NORMAL, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });
    waveGapScale.value = withTiming(WAVE_GAP_SCALE.NORMAL, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });
    await wait(1500);

    setIsBreathing(false);
    return true;
  }, [
    startHapticLoop,
    stopHapticLoop,
    runBreathCycle,
    t,
    waveOffset,
    waveGapScale,
  ]);

  return {
    isBreathing,
    breathText,
    breathTimer,
    waveOffset,
    waveGapScale,
    startBreathing,
  };
}
