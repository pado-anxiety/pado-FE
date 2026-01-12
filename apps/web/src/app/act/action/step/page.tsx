'use client';

import { useTranslation } from 'react-i18next';

import ActStepPage from '@/components/act/ActStepPage';
import { NavButton } from '@/components/ui';
import { StepContent, useActionStep } from '@/features/act/action';

export default function ActionStepPage() {
  const { t } = useTranslation();
  const {
    stepIndex,
    selectedValue,
    selectedDomain,
    lowestDomains,
    orientation,
    obstacle,
    action,
    isNextDisabled,
    handleSelectValue,
    handleSelectDomain,
    handleOrientationChange,
    handleObstacleChange,
    handleActionChange,
    handleNext,
    handleExit,
    handlePrevStep,
  } = useActionStep();

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
      buttonDisabled={isNextDisabled}
    >
      <StepContent
        stepIndex={stepIndex}
        selectedValue={selectedValue}
        selectedDomain={selectedDomain}
        lowestDomains={lowestDomains}
        orientation={orientation}
        obstacle={obstacle}
        action={action}
        onSelectValue={handleSelectValue}
        onSelectDomain={handleSelectDomain}
        onOrientationChange={handleOrientationChange}
        onObstacleChange={handleObstacleChange}
        onActionChange={handleActionChange}
      />
    </ActStepPage>
  );
}
