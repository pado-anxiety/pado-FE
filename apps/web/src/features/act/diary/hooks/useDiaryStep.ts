import { useCallback, useRef, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from '@/lib';
import { safeStringify } from '@/lib/json';

import { DIARY_STEPS, STEP_COUNT } from '../constants';
import { DiaryStep, HistoryCard } from '../types';

export function useDiaryStep() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [historyCards, setHistoryCards] = useState<HistoryCard[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const step: DiaryStep = DIARY_STEPS[stepIndex];

  const handleNext = useCallback(() => {
    if (
      textareaRef.current?.value ||
      (stepIndex === STEP_COUNT - 1 && textareaRef.current?.value !== '')
    ) {
      const newHistoryCard: HistoryCard = {
        question: step.question,
        answer: textareaRef.current?.value || '',
      };

      if (stepIndex === STEP_COUNT - 1) {
        handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
          data: safeStringify([...historyCards, newHistoryCard]),
        });
        handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
          action: 'NEXT',
        });
        return;
      }

      setStepIndex(stepIndex + 1);
      setHistoryCards([...historyCards, newHistoryCard]);
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    }
  }, [step, stepIndex, historyCards]);

  const handleExit = useCallback(() => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  }, []);

  const handlePrevStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex === 0) {
        handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
          action: 'BACK',
        });
        return;
      }

      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
      setHistoryCards(historyCards.slice(0, -1));
      setStepIndex(stepIndex - 1);
    },
    [handlePostMessage, historyCards, setHistoryCards, setStepIndex],
  );

  return {
    step,
    stepIndex,
    historyCards,
    textareaRef,
    handleNext,
    handleExit,
    handlePrevStep,
  };
}
