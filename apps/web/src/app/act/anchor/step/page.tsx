'use client';

import { useCallback } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';
import { Button, Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';
import {
  ANCHOR_STEPS,
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
    setStepIndex,
    setSelectedIndex,
    handleSelectIndex,
  } = useAnchorStep();

  const handleNextStep = useCallback(() => {
    if (selectedIndex !== step.count) {
      return;
    }
    if (stepIndex < ANCHOR_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      setSelectedIndex(0);
      return;
    }
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      const message = JSON.stringify({
        type: WEBVIEW_MESSAGE_TYPE.NAVIGATE,
      });
      window.ReactNativeWebView.postMessage(message);
      return;
    }
  }, [selectedIndex, step.count, stepIndex, setStepIndex, setSelectedIndex]);

  const radius = 35;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - unit * selectedIndex);

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
