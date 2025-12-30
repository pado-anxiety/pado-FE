import { RefObject } from 'react';

type AnswerTextareaProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export function AnswerTextarea({ textareaRef }: AnswerTextareaProps) {
  return (
    <div className="flex-1 flex">
      <textarea
        className="flex-1 p-2 rounded-lg border border-gray-300"
        ref={textareaRef}
      />
    </div>
  );
}
