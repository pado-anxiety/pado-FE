import dynamic from 'next/dynamic';

import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { Loading } from '@/components/ui';

import { Value } from '../../hooks/useActionStep';

const ValueCircleView = dynamic(() => import('../ValueCircle'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center">
      <Loading />
    </div>
  ),
});

type ValueCheckStepProps = {
  selectedValue: Value;
  onSelectValue: (key: keyof Value, value: number) => void;
};

export function ValueCheckStep({
  selectedValue,
  onSelectValue,
}: ValueCheckStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex flex-col gap-2">
        <Text className="text-title-medium font-bold">
          {t('act.values.step.step1.title')}
        </Text>
        <Text className="text-body-medium text-gray-600">
          {t('act.values.step.step1.description')}
        </Text>
      </div>
      <div className="-mx-8">
        <ValueCircleView
          selectedValue={selectedValue}
          onSelectValue={onSelectValue}
        />
      </div>
    </div>
  );
}
