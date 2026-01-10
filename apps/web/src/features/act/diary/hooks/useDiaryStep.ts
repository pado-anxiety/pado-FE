import { useCallback, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage, triggerHaptic } from '@/lib';
import { safeStringify } from '@/lib/json';

import { DIARY_STEPS, STEP_COUNT } from '../constants';
import { DiaryStep, HistoryCard } from '../types';

export function useDiaryStep() {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [historyCards, setHistoryCards] = useState<HistoryCard[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const step: DiaryStep = DIARY_STEPS[stepIndex];

  const handleNext = useCallback(() => {
    if (
      textareaRef.current?.value ||
      (stepIndex === STEP_COUNT - 1 && textareaRef.current?.value !== '')
    ) {
      triggerHaptic('NAVIGATE');
      const newHistoryCard: HistoryCard = {
        question: t(step.i18nKey),
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
  }, [stepIndex, historyCards, t, step]);

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
    [historyCards, setHistoryCards, setStepIndex],
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
