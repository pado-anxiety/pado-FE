import { useCallback, useRef, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from '@/lib';

import { DIARY_STEPS, STEP_COUNT } from '../constants';
import { DiaryStep, HistoryCard } from '../types';

export function useDiaryStep() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [historyCards, setHistoryCards] = useState<HistoryCard[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const step: DiaryStep = DIARY_STEPS[stepIndex];

  const handleNext = useCallback(() => {
    if (!textareaRef.current?.value) {
      return;
    }

    const newHistoryCard: HistoryCard = {
      question: step.question,
      answer: textareaRef.current.value || '',
    };

    if (stepIndex === STEP_COUNT - 1) {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
        data: JSON.stringify([...historyCards, newHistoryCard]),
      });
      return;
    }

    setStepIndex(stepIndex + 1);
    setHistoryCards([...historyCards, newHistoryCard]);
    textareaRef.current.value = '';
  }, [step, stepIndex, historyCards]);

  const handleExit = useCallback(() => {
    console.log('이전');
  }, []);

  return {
    step,
    stepIndex,
    historyCards,
    textareaRef,
    handleNext,
    handleExit,
  };
}
