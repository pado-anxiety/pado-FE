'use client';

import PageLayout from '@/components/ui/layout';
import {
  AnswerArea,
  ExampleSection,
  HistoryCards,
  QuestionSection,
  StepHeader,
  useDiaryStep,
} from '@/features/diary';

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
    <PageLayout>
      <div className="flex flex-col flex-1 gap-3 ">
        <StepHeader
          currentStepIndex={stepIndex}
          onExit={handleExit}
          onNext={handleNext}
        />
        <HistoryCards cards={historyCards} />
        <div className="flex flex-col gap-4">
          <QuestionSection step={step} />
          <ExampleSection
            step={step}
            stepIndex={stepIndex}
          />
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
