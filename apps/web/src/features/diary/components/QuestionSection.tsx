import { Text } from '@pado/ui';

import { DiaryStep } from '../types';

type QuestionSectionProps = {
  step: DiaryStep;
};

export function QuestionSection({ step }: QuestionSectionProps) {
  return (
    <div>
      <Text className="text-body-medium font-bold">{step.question}</Text>
      <Text className="text-body-small">{step.description}</Text>
    </div>
  );
}
