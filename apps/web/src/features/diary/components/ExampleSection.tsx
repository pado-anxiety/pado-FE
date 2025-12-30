import { Text } from '@pado/ui';

import { DiaryStep } from '../types';

type ExampleSectionProps = {
  step: DiaryStep;
};

export function ExampleSection({ step }: ExampleSectionProps) {
  return (
    <div>
      <Text className="text-body-small">예시</Text>
      <Text className="text-body-small">- {step.example.bad}</Text>
      <Text className="text-body-small">- {step.example.good}</Text>
    </div>
  );
}
