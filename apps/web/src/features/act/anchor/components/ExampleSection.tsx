import { Text } from '@pado/ui';

import { Step } from '../types';

type ExampleSectionProps = {
  step: Step;
  index: number;
};

export function ExampleSection({ step, index }: ExampleSectionProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-12">
      <Text className="text-body-small text-sub">
        {index === 0 ? '예) ' : ''} {step.example}
      </Text>
    </div>
  );
}
