import { useCallback, useRef, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from '@/lib';

import { DETACH_STEPS, STEP_COUNT } from '../constants';
import { DetachStep, UserTextToken } from '../types';

export function useDetachStep() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [userTextTokens, setUserTextTokens] = useState<UserTextToken[]>([]);

  const step: DetachStep = DETACH_STEPS[stepIndex];

  const handleChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const handleNext = useCallback(() => {
    if (stepIndex < STEP_COUNT - 1) {
      if (!textareaRef.current?.value) {
        return;
      }
      setUserTextTokens(
        textareaRef.current?.value?.split(' ').map((token) => ({
          text: token,
          isSelected: false,
        })) || [],
      );
      setStepIndex(stepIndex + 1);
    } else {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
        data: userTextTokens,
      });
    }
  }, [stepIndex, userTextTokens]);

  const handleExit = useCallback(() => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  }, []);

  return {
    step,
    stepIndex,
    textareaRef,
    userTextTokens,
    setUserTextTokens,
    handleChange,
    handleNext,
    handleExit,
  };
}
