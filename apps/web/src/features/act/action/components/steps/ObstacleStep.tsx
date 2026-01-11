import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { TextInputStep } from '../TextInputStep';

type ObstacleStepProps = {
  obstacle: string;
  onObstacleChange: (text: string) => void;
};

export function ObstacleStep({
  obstacle,
  onObstacleChange,
}: ObstacleStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Text className="text-title-medium font-bold">
          {t('act.values.step.step3.title')}
        </Text>
        <Text className="text-body-medium text-gray-600">
          {t('act.values.step.step3.description')}
        </Text>
      </div>
      <TextInputStep
        value={obstacle}
        onChange={onObstacleChange}
        placeholder={t('act.values.step.step3.placeholder')}
      />
    </div>
  );
}
