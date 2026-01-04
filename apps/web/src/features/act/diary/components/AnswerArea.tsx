import { RefObject, useCallback } from 'react';

import { Text } from '@pado/ui';

import { DIARY_STEPS, STEP_COUNT } from '../constants';

type AnswerTextareaProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  stepIndex: number;
  feels: string[];
  setFeels: (feels: string[]) => void;
};

const FEELS = [
  '조마조마한',
  '막막한',
  '위축되는',
  '억울한',
  '가슴이 답답한',
  '서운한',
  '머리가 멍한',
  '수치스러운',
  '허무한',
  '조급한',
];

export function AnswerArea({
  textareaRef,
  stepIndex,
  feels,
  setFeels,
}: AnswerTextareaProps) {
  const step = DIARY_STEPS[stepIndex];

  const handleFeelClick = useCallback(
    (feel: string) => {
      setFeels(
        feels.includes(feel)
          ? feels.filter((f) => f !== feel)
          : [...feels, feel],
      );
    },
    [feels, setFeels],
  );

  return (
    <div className="flex flex-col gap-4 flex-1">
      {stepIndex === STEP_COUNT - 1 && (
        <div>
          <div className="flex flex-row gap-2 flex-wrap justify-center">
            {FEELS.map((feel) => (
              <button
                key={feel}
                className="p-2 rounded-lg bg-primary text-white cursor-pointer"
                style={{
                  backgroundColor: feels.includes(feel)
                    ? 'var(--btn-act-page-selected)'
                    : 'var(--btn-act-page-unselected)',
                }}
                onClick={() => handleFeelClick(feel)}
              >
                <Text
                  className={`text-body-small ${feels.includes(feel) ? 'text-white' : 'text-gray-700'}`}
                >
                  {feel}
                </Text>
              </button>
            ))}
          </div>
        </div>
      )}
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
