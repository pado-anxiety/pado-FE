import { Text } from '@pado/ui';

import { DiaryStep } from '../types';

type QuestionSectionProps = {
  step: DiaryStep;
};

export function QuestionSection({ step }: QuestionSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <Text className="text-title-medium font-bold">{step.question}</Text>
      <Text className="text-body-medium">{step.description}</Text>
    </div>
  );
}
