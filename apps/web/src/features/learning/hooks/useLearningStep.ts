import { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage, triggerHaptic } from '@/lib';
import { useDuration } from '@/lib/analytics/useDuration';

import { getLearningData } from '../constants';
import { LearningData, LearningStep } from '../types';

export function useLearningStep(subject: string) {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const { getDuration } = useDuration();
  const { t } = useTranslation();

  const learningData: LearningData | undefined = getLearningData(t)[subject];
  const steps: LearningStep[] = learningData?.steps || [];
  const currentStep: LearningStep | undefined = steps[stepIndex];
  const totalSteps = steps.length;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  const handleNext = useCallback(() => {
    triggerHaptic('NAVIGATE');
    const currentStep = stepIndex;
    if (stepIndex < totalSteps - 1) {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
        action: 'NEXT',
        step: currentStep,
        duration: getDuration(),
      });
      setStepIndex(stepIndex + 1);
    } else {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
        action: 'HOME',
        duration: getDuration(),
      });
    }
  }, [stepIndex, totalSteps, getDuration]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      triggerHaptic('NAVIGATE');
      setStepIndex(stepIndex - 1);
    }
  }, [stepIndex]);

  const handleExit = useCallback(() => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
      duration: getDuration(),
    });
  }, [getDuration]);

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
