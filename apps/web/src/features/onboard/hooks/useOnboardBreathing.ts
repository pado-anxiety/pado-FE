import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { MotionValue, animate } from 'motion/react';

import {
  BREATH_CYCLE_COUNT,
  BREATH_TEXT_KEYS,
  BREATH_TIMING,
  WAVE_CONFIG,
} from '../constants';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useOnboardBreathing(
  baseYValue: MotionValue<number>,
  gapValue: MotionValue<number>,
) {
  const { t } = useTranslation();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('');
  const [breathTimer, setBreathTimer] = useState(0);

  const runBreathCycle = async () => {
    setBreathText(t(BREATH_TEXT_KEYS.INHALE));
    const inhaleTargetY = window.innerHeight * 0.4;

    animate(baseYValue, inhaleTargetY, {
      duration: BREATH_TIMING.INHALE,
      ease: 'easeInOut',
    });
    animate(gapValue, WAVE_CONFIG.GAP_COMPRESSED, {
      duration: BREATH_TIMING.INHALE,
      ease: 'easeInOut',
    });

    for (let i = BREATH_TIMING.INHALE; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }

    setBreathText(t(BREATH_TEXT_KEYS.HOLD));
    for (let i = BREATH_TIMING.HOLD; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }

    setBreathText(t(BREATH_TEXT_KEYS.EXHALE));
    const exhaleTargetY = window.innerHeight * 0.7;

    animate(baseYValue, exhaleTargetY, {
      duration: BREATH_TIMING.EXHALE,
      ease: 'easeInOut',
    });
    animate(gapValue, WAVE_CONFIG.GAP_NORMAL, {
      duration: BREATH_TIMING.EXHALE,
      ease: 'easeInOut',
    });

    for (let i = BREATH_TIMING.EXHALE; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }
  };

  const startBreathing = async () => {
    setIsBreathing(true);

    const readyY = window.innerHeight * 0.85;
    animate(baseYValue, readyY, { duration: 1.5, ease: 'easeInOut' });
    await wait(1500);

    for (let i = 0; i < BREATH_CYCLE_COUNT; i++) {
      await runBreathCycle();
    }

    setBreathText(t('act.embrace.breath.completed'));
    setBreathTimer(0);

    const originalY = window.innerHeight * WAVE_CONFIG.BASE_Y_RATIO;
    animate(baseYValue, originalY, { duration: 1.5, ease: 'easeInOut' });
    animate(gapValue, WAVE_CONFIG.GAP_NORMAL, {
      duration: 1.5,
      ease: 'easeInOut',
    });

    await wait(1500);

    setIsBreathing(false);
    return true;
  };

  return {
    isBreathing,
    breathText,
    breathTimer,
    startBreathing,
  };
}
