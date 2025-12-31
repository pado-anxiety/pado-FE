import { useCallback, useRef, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from '@/lib';

import { DIARY_STEPS, STEP_COUNT } from '../constants';
import { DiaryStep, HistoryCard } from '../types';

export function useDiaryStep() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [historyCards, setHistoryCards] = useState<HistoryCard[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [feels, setFeels] = useState<string[]>([]);

  const step: DiaryStep = DIARY_STEPS[stepIndex];

  const handleNext = useCallback(() => {
    if (
      textareaRef.current?.value ||
      (stepIndex === STEP_COUNT - 1 &&
        (feels.length > 0 || textareaRef.current?.value !== ''))
    ) {
      const newHistoryCard: HistoryCard = {
        question: step.question,
        answer: textareaRef.current?.value || '',
      };

      if (stepIndex === STEP_COUNT - 1) {
        handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
          data: JSON.stringify([...historyCards, { ...newHistoryCard, feels }]),
        });
        return;
      }

      setStepIndex(stepIndex + 1);
      setHistoryCards([...historyCards, newHistoryCard]);
      if (textareaRef.current) {
        textareaRef.current.value = '';
      }
    }
  }, [step, stepIndex, historyCards, feels]);

  const handleExit = useCallback(() => {
    // TODO: 이전 페이지로 이동 구현
  }, []);

  return {
    step,
    stepIndex,
    historyCards,
    textareaRef,
    handleNext,
    handleExit,
    feels,
    setFeels,
  };
}
