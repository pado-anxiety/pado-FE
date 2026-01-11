'use client';

import { ArrowLeft, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@pado/ui';

import ActStepPage from '@/components/act/ActStepPage';
import { StepContent, useActionStep } from '@/features/act/action';

export default function ActionStepPage() {
  const { t } = useTranslation();
  const {
    stepIndex,
    selectedValue,
    reason,
    action,
    isNextDisabled,
    handleSelectValue,
    handleReasonChange,
    handleActionChange,
    handleNext,
    handleExit,
    handlePrevStep,
  } = useActionStep();

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
      buttonText={t('common.button.next')}
      onButtonClick={handleNext}
      buttonDisabled={isNextDisabled}
    >
      <StepContent
        stepIndex={stepIndex}
        selectedValue={selectedValue}
        reason={reason}
        action={action}
        onSelectValue={handleSelectValue}
        onReasonChange={handleReasonChange}
        onActionChange={handleActionChange}
      />
    </ActStepPage>
  );
}
