'use client';

import { Button } from '@pado/ui';
import { ArrowLeft, X } from 'lucide-react';

import ActStepPage from '@/components/act/ActStepPage';
import { StepContent, useDetachStep } from '@/features/act/detach';

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
    handlePrevStep,
  } = useDetachStep();

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
      <StepContent
        step={step}
        stepIndex={stepIndex}
        textareaRef={textareaRef}
        userTextTokens={userTextTokens}
        setUserTextTokens={setUserTextTokens}
        handleChange={handleChange}
      />
    </ActStepPage>
  );
}
