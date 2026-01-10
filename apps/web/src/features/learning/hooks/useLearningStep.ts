import { useCallback, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from '@/lib';

import { LEARNING_DATA } from '../constants';
import { LearningData, LearningStep } from '../types';

export function useLearningStep(subject: string) {
  const [stepIndex, setStepIndex] = useState<number>(0);

  const learningData: LearningData | undefined = LEARNING_DATA[subject];
  const steps: LearningStep[] = learningData?.steps || [];
  const currentStep: LearningStep | undefined = steps[stepIndex];
  const totalSteps = steps.length;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  const handleNext = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
        action: 'HOME',
      });
    }
  }, [stepIndex, totalSteps]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  }, [stepIndex]);

  const handleExit = useCallback(() => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  }, []);

  return {
    learningData,
    currentStep,
    stepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleExit,
  };
}
