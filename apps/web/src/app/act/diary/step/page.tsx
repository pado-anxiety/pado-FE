'use client';

import PageLayout from '@/components/ui/layout';
import {
  AnswerTextarea,
  ExampleSection,
  HistoryCards,
  QuestionSection,
  StepHeader,
  useDiaryStep,
} from '@/features/diary';

export default function DiaryStepPage() {
  const { step, stepIndex, historyCards, textareaRef, handleNext, handleExit } =
    useDiaryStep();

  return (
    <PageLayout>
      <div className="flex flex-col flex-1 gap-3">
        <StepHeader
          currentStepIndex={stepIndex}
          onExit={handleExit}
          onNext={handleNext}
        />
        <HistoryCards cards={historyCards} />
        <div className="flex flex-col gap-4">
          <QuestionSection step={step} />
          <ExampleSection step={step} />
        </div>
        <AnswerTextarea textareaRef={textareaRef} />
      </div>
    </PageLayout>
  );
}
