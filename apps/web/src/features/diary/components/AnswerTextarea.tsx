import { ChangeEvent, RefObject, useCallback, useRef } from 'react';

type AnswerTextareaProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export function AnswerTextarea({ textareaRef }: AnswerTextareaProps) {
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

  return (
    <div className="flex-1 flex">
      <textarea
        className="flex-1 p-2 rounded-lg border border-gray-300 resize-none overflow-hidden focus:outline-none focus:ring-0"
        ref={textareaRef}
        onChange={handleChange}
      />
    </div>
  );
}
