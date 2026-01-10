'use client';

import { Text } from '@pado/ui';

import { LearningStep } from '../types';

interface LearningStepContentProps {
  step: LearningStep;
}

export function LearningStepContent({ step }: LearningStepContentProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* 이미지 - 너비 전체 채움 */}
      {/* <div className="aspect-[3/2] w-full overflow-hidden rounded-xl bg-neutral-200">
        {step.image ? (
          <img
            src={step.image}
            alt={step.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blue-400">
            <Text className="text-body-medium text-white">이미지</Text>
          </div>
        )}
      </div> */}

      {/* 제목 */}
      <Text className="text-title-medium">{step.title}</Text>

      {/* 설명 */}
      <Text className="text-body-medium text-sub">{step.content}</Text>
    </div>
  );
}
