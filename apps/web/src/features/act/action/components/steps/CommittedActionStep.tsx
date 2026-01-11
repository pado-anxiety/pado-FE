import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { TextInputStep } from '../TextInputStep';

type CommittedActionStepProps = {
  action: string;
  onActionChange: (text: string) => void;
};

export function CommittedActionStep({
  action,
  onActionChange,
}: CommittedActionStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Text className="text-title-medium font-bold">
          {t('act.values.step.step4.title')}
        </Text>
        <Text className="text-body-medium text-gray-600">
          {t('act.values.step.step4.description')}
        </Text>
      </div>
      <TextInputStep
        value={action}
        onChange={onActionChange}
        placeholder={t('act.values.step.step4.placeholder')}
      />
    </div>
  );
}
