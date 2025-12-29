import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ACT_ROUTES } from '@/lib/route/act';

import { ANCHOR_STEPS } from '../constants';
import { Step } from '../types';

export function useAnchorStep() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const step: Step = ANCHOR_STEPS[stepIndex];
  const unit = (100 / step.count) * 0.01;

  const handleNextStep = useCallback(() => {
    if (selectedIndex !== step.count) {
      return;
    }
    if (stepIndex < ANCHOR_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      setSelectedIndex(0);
      return;
    }
    router.push(ACT_ROUTES.ANCHOR.RESULT);
  }, [selectedIndex, step.count, stepIndex, router]);

  const handleSelectIndex = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const isNextDisabled = selectedIndex !== step.count;

  return {
    step,
    stepIndex,
    selectedIndex,
    unit,
    isNextDisabled,
    handleNextStep,
    handleSelectIndex,
  };
}
