'use client';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';
import { ArrowLeft, X } from 'lucide-react';

import ActStepPage from '@/components/act/ActStepPage';
import {
  CountButtons,
  ExampleSection,
  ProgressCircle,
  StepContent,
  useAnchorStep,
} from '@/features/act/anchor';
import { handlePostMessage } from '@/lib';

export default function AnchorStepPage() {
  const {
    step,
    stepIndex,
    selectedIndex,
    unit,
    isNextDisabled,
    handleMovePrevStep,
    handleNextStep,
    handleSelectIndex,
  } = useAnchorStep();

  const radius = 42; // svg viewbox percentage, 0 ~ 100
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - unit * selectedIndex);

  const handleGoBack = () => {
    if (stepIndex > 0) {
      handleMovePrevStep(stepIndex);
      return;
    }
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'BACK',
    });
  };

  const handleGoHome = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  const leftButton = (
    <Button
      size="sm"
      color="link"
      onClick={handleGoBack}
    >
      <ArrowLeft
        size={30}
        color="black"
      />
    </Button>
  );

  const rightButton = (
    <Button
      size="sm"
      color="link"
      onClick={handleGoHome}
    >
      <X
        size={30}
        color="black"
      />
    </Button>
  );

  return (
    <ActStepPage
      leftButton={leftButton}
      rightButton={rightButton}
      buttonText="다음"
      onButtonClick={handleNextStep}
      buttonDisabled={isNextDisabled}
    >
      <div className="flex flex-col flex-1 w-full gap-8 justify-center items-center pt-8">
        <div className="flex flex-col flex-1 w-full gap-8 justify-center items-center">
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
          <ExampleSection
            step={step}
            index={stepIndex}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center items-center gap-8">
          <CountButtons
            count={step.count}
            selectedIndex={selectedIndex}
            onSelect={handleSelectIndex}
          />
          <Text className="text-label-medium text-sub">
            * 감각을 찾으면 버튼을 눌러주세요
          </Text>
        </div>
      </div>
    </ActStepPage>
  );
}
