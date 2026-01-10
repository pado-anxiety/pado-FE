'use client';

import { Text } from '@pado/ui';

import { LearningStep } from '../types';

interface LearningStepContentProps {
  step: LearningStep;
}

export function LearningStepContent({ step }: LearningStepContentProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Text className="text-title-medium">{step.title}</Text>

      <div className="flex flex-col gap-1">
        {step.content.map((content) => (
          <Text
            key={content}
            className="text-body-medium"
          >
            {content}
          </Text>
        ))}
      </div>
    </div>
  );
}
