import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

type TextInputStepProps = {
  i18nKey: string;
  value: string;
  onChange: (text: string) => void;
};

export function TextInputStep({ i18nKey, value, onChange }: TextInputStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex flex-col gap-2">
        <Text className="text-title-medium font-bold">
          {t(`${i18nKey}.title`)}
        </Text>
        <Text className="text-body-medium text-gray-600">
          {t(`${i18nKey}.description`)}
        </Text>
      </div>
      <textarea
        className="flex-1 min-h-[200px] p-4 text-body-medium resize-none scrollbar-hide focus:outline-none focus:ring-0 bg-white/60 rounded-2xl border border-white shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(`${i18nKey}.placeholder`)}
      />
    </div>
  );
}
