'use client';

import { Button } from '@pado/ui';
import { ArrowLeft, X } from 'lucide-react';

import ActStepPage from '@/components/act/ActStepPage';
import { Divide } from '@/components/ui';
import {
  AnswerArea,
  HistoryCards,
  QuestionSection,
  useDiaryStep,
} from '@/features/act/diary';

export default function DiaryStepPage() {
  const {
    step,
    stepIndex,
    historyCards,
    textareaRef,
    handleNext,
    handleExit,
    handlePrevStep,
  } = useDiaryStep();

  const leftButton = (
    <Button
      size="sm"
      color="link"
      onClick={() => handlePrevStep(stepIndex)}
    >
      <ArrowLeft
        size={30}
        color="black"
      />
    </Button>
  );

  const rightButton = (
    <Button
      size="sm"
      color="link"
      onClick={handleExit}
    >
      <X
        size={30}
        color="black"
      />
    </Button>
  );

  return (
    <ActStepPage
      leftButton={leftButton}
      rightButton={rightButton}
      buttonText="다음"
      onButtonClick={handleNext}
    >
      <div className="flex flex-col gap-2 flex-1">
        <HistoryCards cards={historyCards} />
        {historyCards.length > 0 && <Divide />}
        <div className="flex flex-col gap-4">
          <QuestionSection step={step} />
        </div>
        <AnswerArea
          textareaRef={textareaRef}
          stepIndex={stepIndex}
        />
      </div>
    </ActStepPage>
  );
}
