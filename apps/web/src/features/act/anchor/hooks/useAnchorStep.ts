import { useCallback, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage, triggerHaptic } from '@/lib';
import { useDuration } from '@/lib/analytics/useDuration';

import { ANCHOR_STEPS } from '../constants';
import { Step } from '../types';

export function useAnchorStep() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { getDuration } = useDuration();

  const step: Step = ANCHOR_STEPS[stepIndex];
  const unit = (100 / step.count) * 0.01;

  const handleNextStep = useCallback(() => {
    if (selectedIndex !== step.count) {
      return;
    }
    triggerHaptic('NAVIGATE');
    const currentStep = stepIndex;
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
      step: currentStep,
      duration: getDuration(),
    });
    if (stepIndex < ANCHOR_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      setSelectedIndex(0);
      return;
    }
    console.log('RESULT', currentStep);
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'RESULT',
      step: currentStep,
      duration: getDuration(),
    });
  }, [
    selectedIndex,
    step.count,
    stepIndex,
    setStepIndex,
    setSelectedIndex,
    getDuration,
  ]);

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
