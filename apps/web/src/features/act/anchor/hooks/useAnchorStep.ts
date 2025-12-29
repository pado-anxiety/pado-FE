import { useCallback, useState } from 'react';

import { ANCHOR_STEPS } from '../constants';
import { Step } from '../types';

export function useAnchorStep() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const step: Step = ANCHOR_STEPS[stepIndex];
  const unit = (100 / step.count) * 0.01;

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
    setStepIndex,
    setSelectedIndex,
    handleSelectIndex,
  };
}
