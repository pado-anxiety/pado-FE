import { RefObject, useCallback, useEffect } from 'react';

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
  const handleChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [textareaRef]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
  }, [stepIndex, textareaRef]);

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
    <div className="flex flex-col gap-4">
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
      <textarea
        className="p-2 text-body-medium rounded-lg border-none bg-page resize-none overflow-hidden focus:outline-none focus:ring-0"
        ref={textareaRef}
        placeholder={
          stepIndex === STEP_COUNT - 1
            ? '또는 직접 작성해보세요'
            : '내용을 입력해보세요'
        }
        onChange={handleChange}
      />
    </div>
  );
}
