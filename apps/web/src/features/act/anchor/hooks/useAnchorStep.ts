import { useCallback, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from '@/lib';

import { ANCHOR_STEPS } from '../constants';
import { Step } from '../types';

export function useAnchorStep() {
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

    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
    });
  }, [selectedIndex, step.count, stepIndex, setStepIndex, setSelectedIndex]);

  const handleSelectIndex = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleMovePrevStep = useCallback(
    (stepIndex: number) => {
      setStepIndex(stepIndex - 1);
      setSelectedIndex(0);
    },
    [setStepIndex, setSelectedIndex],
  );

  const isNextDisabled = selectedIndex !== step.count;

  return {
    step,
    stepIndex,
    selectedIndex,
    unit,
    isNextDisabled,
    handleNextStep,
    handleSelectIndex,
    handleMovePrevStep,
  };
}
