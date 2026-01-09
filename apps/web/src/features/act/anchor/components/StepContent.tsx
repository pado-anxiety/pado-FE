import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { Step } from '../types';

type StepContentProps = {
  step: Step;
};

export function StepContent({ step }: StepContentProps) {
  const { t } = useTranslation();
  const description = t(`${step.i18nKey}.description`, { returnObjects: true }) as string[];

  return (
    <div className="flex-1 flex flex-col gap-2 justify-center items-center absolute top-0 left-0 w-full aspect-square z-100">
      <Text className="text-title-medium bg-act-page rounded-lg p-2">
        {t(`${step.i18nKey}.subject`)}
      </Text>
      <div className="flex flex-col items-center">
        {description.map((desc) => (
          <Text
            key={desc}
            className="text-body-medium font-normal"
          >
            {desc}
          </Text>
        ))}
      </div>
    </div>
  );
}
