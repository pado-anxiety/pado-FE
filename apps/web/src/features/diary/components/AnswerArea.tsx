import { ChangeEvent, RefObject, useCallback, useRef } from 'react';

import { Text } from '@pado/ui';

import { STEP_COUNT } from '../constants';

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
  const prevValueRef = useRef<string>('');

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const target = e.target;

      if (target.scrollHeight > target.clientHeight && textareaRef.current) {
        textareaRef.current.value = prevValueRef.current;
        return;
      }

      prevValueRef.current = target.value;
    },
    [textareaRef],
  );

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
    <div className="flex-1 flex flex-col gap-4">
      {stepIndex === STEP_COUNT - 1 && (
        <div>
          <div className="flex flex-row gap-2 flex-wrap justify-center">
            {FEELS.map((feel) => (
              <button
                key={feel}
                className="p-2 rounded-lg bg-primary text-white cursor-pointer"
                style={{
                  backgroundColor: feels.includes(feel)
                    ? 'var(--bg-secondary)'
                    : 'var(--bg-primary)',
                }}
                onClick={() => handleFeelClick(feel)}
              >
                <Text
                  className={`${feels.includes(feel) ? 'text-white' : 'text-primary'}`}
                >
                  {feel}
                </Text>
              </button>
            ))}
          </div>
        </div>
      )}
      {stepIndex === STEP_COUNT - 1 && (
        <Text className="text-body-small text-center">
          또는 직접 작성해보세요.
        </Text>
      )}
      <textarea
        className={`${stepIndex === STEP_COUNT - 1 ? '' : 'flex-1'} p-2 rounded-lg border border-gray-300 resize-none overflow-hidden focus:outline-none focus:ring-0`}
        ref={textareaRef}
        onChange={handleChange}
      />
    </div>
  );
}
