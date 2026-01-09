import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { Step } from '../types';

type ExampleSectionProps = {
  step: Step;
  index: number;
};

export function ExampleSection({ step, index }: ExampleSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center gap-12">
      <Text className="text-body-small text-sub">
        {index === 0 ? `${t('common.example')}) ` : ''} {t(`${step.i18nKey}.example`)}
      </Text>
    </div>
  );
}
