import { RefObject } from 'react';

import { DIARY_STEPS, STEP_COUNT } from '../constants';

type AnswerTextareaProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  stepIndex: number;
};

export function AnswerArea({ textareaRef, stepIndex }: AnswerTextareaProps) {
  const step = DIARY_STEPS[stepIndex];

  // TODO: 전체 페이지가 스크롤되는 문제
  return (
    <div className="flex flex-col gap-4 flex-1">
      <textarea
        className="flex-1 p-4 text-body-small resize-none scrollbar-hide focus:outline-none focus:ring-0 bg-white/60 rounded-2xl border border-white shadow-sm"
        ref={textareaRef}
        placeholder={
          stepIndex === STEP_COUNT - 1
            ? '또는 직접 작성해보세요'
            : `${'예시)\n' + step.example.bad + '\n' + step.example.good}`
        }
      />
    </div>
  );
}
