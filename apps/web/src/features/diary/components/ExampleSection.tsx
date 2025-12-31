import { Text } from '@pado/ui';

import { STEP_COUNT } from '../constants';
import { DiaryStep } from '../types';

type ExampleSectionProps = {
  step: DiaryStep;
  stepIndex: number;
};

export function ExampleSection({ step, stepIndex }: ExampleSectionProps) {
  if (stepIndex === STEP_COUNT - 1) {
    return null;
  }

  return (
    <div>
      <Text className="text-body-small">예시</Text>
      <Text className="text-body-small">- {step.example.bad}</Text>
      <Text className="text-body-small">- {step.example.good}</Text>
    </div>
  );
}
