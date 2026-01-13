'use client';

import { DescriptionList } from '@/components/ui';

import { LearningStep } from '../types';

interface LearningStepContentProps {
  step: LearningStep;
}

export function LearningStepContent({ step }: LearningStepContentProps) {
  return (
    <div className="flex flex-1 flex-col">
      <DescriptionList
        title={step.title}
        items={step.content}
      />
    </div>
  );
}
