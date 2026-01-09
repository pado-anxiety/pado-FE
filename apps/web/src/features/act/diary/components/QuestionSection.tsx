import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { DiaryStep } from '../types';

type QuestionSectionProps = {
  step: DiaryStep;
};

export function QuestionSection({ step }: QuestionSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      <Text className="text-title-medium font-bold">
        {t(`${step.i18nKey}.question`)}
      </Text>
      <Text className="text-body-medium">
        {t(`${step.i18nKey}.description`)}
      </Text>
    </div>
  );
}
