import { useCallback, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage, triggerHaptic } from '@/lib';
import { useDuration } from '@/lib/analytics/useDuration';

import { DETACH_STEPS, STEP_COUNT } from '../constants';
import { DetachStep, UserTextToken } from '../types';

const MAX_CHAR_LIMIT = 100;

export function useDetachStep() {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [userTextTokens, setUserTextTokens] = useState<UserTextToken[]>([]);

  const { getDuration } = useDuration();

  const step: DetachStep = DETACH_STEPS[stepIndex];

  const handleChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const validateCharLimit = useCallback(
    (text: string): boolean => {
      if (text.length > MAX_CHAR_LIMIT) {
        handlePostMessage(WEBVIEW_MESSAGE_TYPE.VALIDATE, {
          title: t('common.validation.charLimitExceeded'),
          message: t('common.validation.charLimitMessage', {
            maxLength: MAX_CHAR_LIMIT,
            currentLength: text.length,
          }),
        });
        return false;
      }
      return true;
    },
    [t],
  );

  const handleNext = useCallback(() => {
    const currentStep = stepIndex;
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'NEXT',
      step: currentStep,
      duration: getDuration(),
    });
    if (stepIndex < STEP_COUNT - 1) {
      if (!textareaRef.current?.value) {
        return;
      }
      // Validate character limit for text input step
      if (stepIndex === 0 && !validateCharLimit(textareaRef.current.value)) {
        return;
      }
      triggerHaptic('NAVIGATE');
      setUserTextTokens(
        textareaRef.current?.value?.split(' ').map((token) => ({
          text: token,
          isSelected: false,
        })) || [],
      );
      setStepIndex(stepIndex + 1);
    } else {
      triggerHaptic('NAVIGATE');
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
        data: userTextTokens,
      });
    }
  }, [stepIndex, userTextTokens, validateCharLimit, getDuration]);

  const handleExit = useCallback(() => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
      step: stepIndex,
      duration: getDuration(),
    });
  }, [stepIndex, getDuration]);

  const handlePrevStep = useCallback(
    (currentStepIndex: number) => {
      if (currentStepIndex === 0) {
        handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
          action: 'BACK',
          step: currentStepIndex,
          duration: getDuration(),
        });
        return;
      }

      setStepIndex(currentStepIndex - 1);
      setUserTextTokens([]);
    },
    [getDuration],
  );

  return {
    step,
    stepIndex,
    textareaRef,
    userTextTokens,
    setUserTextTokens,
    handleChange,
    handleNext,
    handleExit,
    handlePrevStep,
  };
}
