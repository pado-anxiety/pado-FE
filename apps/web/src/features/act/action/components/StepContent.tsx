import dynamic from 'next/dynamic';

import { useTranslation } from 'react-i18next';

import { Button, Text } from '@pado/ui';

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
  selectedDomain: keyof Value | null;
  getLowestDomains: (values: Value) => string[];
  orientation: string;
  obstacle: string;
  action: string;
  onSelectValue: (key: keyof Value, value: number) => void;
  onSelectDomain: (domain: keyof Value) => void;
  onOrientationChange: (text: string) => void;
  onObstacleChange: (text: string) => void;
  onActionChange: (text: string) => void;
};

export function StepContent({
  stepIndex,
  selectedValue,
  selectedDomain,
  getLowestDomains,
  orientation,
  obstacle,
  action,
  onSelectValue,
  onSelectDomain,
  onOrientationChange,
  onObstacleChange,
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
    const keyMap = {
      work: '일',
      growth: '성장',
      leisure: '여가',
      relationship: '관계',
    };

    const lowestDomains = getLowestDomains(selectedValue);

    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-row gap-2 flex-wrap">
          {lowestDomains.length > 1 &&
            lowestDomains.map((key) => (
              <Button
                key={key}
                onClick={() => onSelectDomain(key as keyof Value)}
                fullWidth={false}
                className={`py-2 px-4 rounded-2xl ${selectedDomain !== key ? 'bg-blue-100 text-black' : 'bg-btn-act-page text-white font-bold'}`}
              >
                <Text className="text-body-small">
                  {keyMap[key as keyof typeof keyMap]}
                </Text>
              </Button>
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <Text className="text-title-medium font-bold">
            <Text
              as="span"
              className="text-title-medium bg-btn-act-page text-white font-bold py-2 px-4 rounded-2xl"
            >
              {keyMap[selectedDomain as keyof Value]}
            </Text>{' '}
            영역 중 추구하고자 하는 방향을 작성해보세요
          </Text>
          <Text className="text-body-medium text-gray-600">
            하나만 골라서 작성
          </Text>
        </div>
        <TextInputStep
          value={orientation}
          onChange={onOrientationChange}
          placeholder="영역 중 추구하고자 하는 방향을 작성해보세요"
        />
      </div>
    );
  }

  if (stepIndex === 2) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Text className="text-title-medium font-bold">
            그걸 막는 장애물은? 작성해보세요
          </Text>
          <Text className="text-body-medium text-gray-600">
            그걸 막는 장애물을 작성해보세요
          </Text>
        </div>
        <TextInputStep
          value={obstacle}
          onChange={onObstacleChange}
          placeholder="그걸 막는 장애물을 작성해보세요"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Text className="text-title-medium font-bold">
          할 수 있는 구체적이고 작은 일을 입력해보세요
        </Text>
        <Text className="text-body-medium text-gray-600">
          작고 구체적인 일, 지금 당장 할 수 있는 일
        </Text>
      </div>
      <TextInputStep
        value={action}
        onChange={onActionChange}
        placeholder="투두 입력"
      />
    </div>
  );
}
