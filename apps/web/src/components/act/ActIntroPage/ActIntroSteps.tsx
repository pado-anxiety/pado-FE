'use client';

import { Text } from '@pado/ui';

interface ActIntroStepsProps {
  steps: string[];
}

function ActIntroSteps({ steps }: ActIntroStepsProps) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step) => (
        <Text
          key={step}
          className="text-body-small"
        >
          {step}
        </Text>
      ))}
    </div>
  );
}

export default ActIntroSteps;
