import { RefObject } from 'react';

type TextInputAreaProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextInputArea({ textareaRef, onChange }: TextInputAreaProps) {
  return (
    <textarea
      ref={textareaRef}
      className="flex-1 text-body-medium scrollbar-hide w-full resize-none focus:outline-none focus:ring-0 p-4 bg-white/50 rounded-xl border border-white"
      placeholder='예: "나는 아무것도 제대로 못 할 거야", "다들 나를 싫어하면 어떡하지?"'
      onChange={onChange}
    />
  );
}
