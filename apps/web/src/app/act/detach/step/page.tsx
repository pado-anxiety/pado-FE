'use client';

import { useTranslation } from 'react-i18next';

import ActStepPage from '@/components/act/ActStepPage';
import { NavButton } from '@/components/ui';
import { StepContent, useDetachStep } from '@/features/act/detach';

export default function DetachStepPage() {
  const { t } = useTranslation();
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
    <NavButton
      variant="back"
      size="large"
      onClick={() => handlePrevStep(stepIndex)}
    />
  );

  const rightButton = (
    <NavButton
      variant="close"
      size="large"
      onClick={handleExit}
    />
  );

  return (
    <ActStepPage
      leftButton={leftButton}
      rightButton={rightButton}
      buttonText={t('common.button.next')}
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
