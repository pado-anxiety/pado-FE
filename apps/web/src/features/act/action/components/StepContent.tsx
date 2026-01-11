import dynamic from 'next/dynamic';

import { useTranslation } from 'react-i18next';

import { Text } from '@pado/ui';

import { ACTION_STEPS } from '../constants';
import { Value } from '../hooks/useActionStep';
import { TextInputStep } from './TextInputStep';

const ValueCircleView = dynamic(() => import('./ValueCircle'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

type StepContentProps = {
  stepIndex: number;
  selectedValue: Value;
  reason: string;
  action: string;
  onSelectValue: (key: string, value: number) => void;
  onReasonChange: (text: string) => void;
  onActionChange: (text: string) => void;
};

export function StepContent({
  stepIndex,
  selectedValue,
  reason,
  action,
  onSelectValue,
  onReasonChange,
  onActionChange,
}: StepContentProps) {
  const { t } = useTranslation();
  const step = ACTION_STEPS[stepIndex];

  if (stepIndex === 0) {
    return (
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-2">
          <Text className="text-title-medium font-bold">
            {t(`${step.i18nKey}.title`)}
          </Text>
          <Text className="text-body-medium text-gray-600">
            {t(`${step.i18nKey}.description`)}
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

  if (stepIndex === 1) {
    return (
      <TextInputStep
        i18nKey={step.i18nKey}
        value={reason}
        onChange={onReasonChange}
      />
    );
  }

  return (
    <TextInputStep
      i18nKey={step.i18nKey}
      value={action}
      onChange={onActionChange}
    />
  );
}
