'use client';

import { Button, Text } from '@pado/ui';

import {
  CountButtons,
  ExampleSection,
  ProgressCircle,
  StepContent,
  useAnchorStep,
} from '@/features/act/anchor';

export default function AnchorStepPage() {
  const {
    step,
    stepIndex,
    selectedIndex,
    unit,
    isNextDisabled,
    handleNextStep,
    handleSelectIndex,
  } = useAnchorStep();

  const radius = 35;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - unit * selectedIndex);

  return (
    <div className="flex flex-col flex-1 justify-between items-center">
      <div className="relative w-full aspect-square">
        <ProgressCircle
          radius={radius}
          strokeWidth={strokeWidth}
          circumference={circumference}
          offset={offset}
          stepIndex={stepIndex}
        />
        <StepContent step={step} />
      </div>
      <div className="flex flex-col justify-center items-center gap-12">
        <ExampleSection step={step} />
        <CountButtons
          count={step.count}
          selectedIndex={selectedIndex}
          onSelect={handleSelectIndex}
        />
        <Text className="text-label-medium">
          * 감각을 찾으면 버튼을 눌러주세요
        </Text>
      </div>
      <Button
        size="default"
        text="다음"
        onClick={handleNextStep}
        disabled={isNextDisabled}
      />
    </div>
  );
}
