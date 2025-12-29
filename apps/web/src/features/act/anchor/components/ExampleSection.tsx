import { Text } from '@pado/ui';

import { Step } from '../types';

type ExampleSectionProps = {
  step: Step;
};

export function ExampleSection({ step }: ExampleSectionProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-12">
      <Text className="text-body-medium">예) {step.example}</Text>
    </div>
  );
}
