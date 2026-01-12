'use client';

import { useTranslation } from 'react-i18next';

import ActStepPage from '@/components/act/ActStepPage';
import { Divide, NavButton } from '@/components/ui';
import {
  AnswerArea,
  HistoryCards,
  QuestionSection,
  useDiaryStep,
} from '@/features/act/diary';

export default function DiaryStepPage() {
  const { t } = useTranslation();
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
