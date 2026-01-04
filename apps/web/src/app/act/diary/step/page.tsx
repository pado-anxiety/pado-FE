'use client';

import { Divide } from '@/components/ui';
import PageLayout from '@/components/ui/layout';
import {
  AnswerArea,
  HistoryCards,
  QuestionSection,
  StepHeader,
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
    feels,
    setFeels,
  } = useDiaryStep();

  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-col flex-1 bg-act-page gap-3 overflow-y-auto scrollbar-hide">
        <StepHeader
          onExit={handleExit}
          onNext={handleNext}
        />
        <HistoryCards cards={historyCards} />
        {historyCards.length > 0 && <Divide />}
        <div className="flex flex-col gap-4">
          <QuestionSection step={step} />
        </div>
        <AnswerArea
          textareaRef={textareaRef}
          stepIndex={stepIndex}
          feels={feels}
          setFeels={setFeels}
        />
      </div>
    </PageLayout>
  );
}
