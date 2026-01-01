import { RefObject } from 'react';

type TextInputAreaProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextInputArea({ textareaRef, onChange }: TextInputAreaProps) {
  return (
    <textarea
      ref={textareaRef}
      className="text-body-medium w-full bg-page overflow-hidden resize-none focus:outline-none focus:ring-0"
      placeholder="무엇 때문에 불안을 느끼는지 자유롭게 적어보세요"
      onChange={onChange}
    />
  );
}
