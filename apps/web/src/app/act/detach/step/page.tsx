'use client';

import PageLayout from '@/components/ui/layout';
import { StepContent, StepHeader, useDetachStep } from '@/features/act/detach';

export default function DetachStepPage() {
  const {
    step,
    stepIndex,
    textareaRef,
    userTextTokens,
    setUserTextTokens,
    handleChange,
    handleNext,
    handleExit,
  } = useDetachStep();

  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-col justify-between items-center gap-4">
        <StepHeader
          onExit={handleExit}
          onNext={handleNext}
        />
        <div className="flex-1">
          <StepContent
            step={step}
            stepIndex={stepIndex}
            textareaRef={textareaRef}
            userTextTokens={userTextTokens}
            setUserTextTokens={setUserTextTokens}
            handleChange={handleChange}
          />
        </div>
      </div>
    </PageLayout>
  );
}
