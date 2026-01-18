import { RefObject } from 'react';

import { useTranslation } from 'react-i18next';

type TextInputAreaProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextInputArea({ textareaRef, onChange }: TextInputAreaProps) {
  const { t } = useTranslation();

  return (
    <textarea
      ref={textareaRef}
      className="flex-1 text-body-medium scrollbar-hide w-full resize-none focus:outline-none focus:ring-0 p-4 bg-white/50 rounded-xl border border-white"
      placeholder={t('act.detach.step.step1.placeholder')}
      onChange={onChange}
    />
  );
}
