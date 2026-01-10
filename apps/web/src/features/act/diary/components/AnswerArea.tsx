import { RefObject } from 'react';

import { useTranslation } from 'react-i18next';

import { DIARY_STEPS, STEP_COUNT } from '../constants';

type AnswerTextareaProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  stepIndex: number;
};

export function AnswerArea({ textareaRef, stepIndex }: AnswerTextareaProps) {
  const { t } = useTranslation();
  const step = DIARY_STEPS[stepIndex];

  const getPlaceholder = () => {
    if (stepIndex === STEP_COUNT - 1) {
      return t('act.diary.step.placeholder');
    }

    const exampleBad = t(`${step.i18nKey}.exampleBad`);
    const exampleGood = t(`${step.i18nKey}.exampleGood`);
    return `${t('common.example')})\n${exampleBad}\n${exampleGood}`;
  };

  return (
    <div className="flex flex-col gap-4 flex-1">
      <textarea
        className="flex-1 p-4 text-body-small resize-none scrollbar-hide focus:outline-none focus:ring-0 bg-white/60 rounded-2xl border border-white shadow-sm"
        ref={textareaRef}
        placeholder={getPlaceholder()}
      />
    </div>
  );
}
