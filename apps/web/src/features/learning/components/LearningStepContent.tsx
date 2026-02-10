'use client';

import { Text } from '@pado/ui';

import { LearningStep } from '../types';

interface LearningStepContentProps {
  step: LearningStep;
}

export function LearningStepContent({ step }: LearningStepContentProps) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <Text
        preset="heading"
        bold
      >
        {step.title}
      </Text>
      <div className="flex flex-col gap-3">
        {step.content.map((item, index) => (
          <Text
            key={`${item}-${index}`}
            preset="body"
          >
            {item}
          </Text>
        ))}
      </div>
    </div>
  );
}
