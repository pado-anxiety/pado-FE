import { Text } from '@pado/ui';

import { Step } from '../types';

type StepContentProps = {
  step: Step;
};

export function StepContent({ step }: StepContentProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center absolute top-0 left-0 w-full aspect-square z-100">
      <Text className="text-title-large">{step.subject}</Text>
      {step.description.map((desc) => (
        <Text
          key={desc}
          className="text-body-large"
        >
          {desc}
        </Text>
      ))}
    </div>
  );
}
