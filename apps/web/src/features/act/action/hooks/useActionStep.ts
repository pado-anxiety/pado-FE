import { useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from '@/lib';

import { ACTION_STEPS, STEP_COUNT } from '../constants';

export type Value = {
  work: number | null;
  growth: number | null;
  leisure: number | null;
  relationship: number | null;
};

export function useActionStep() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState<Value>({
    work: null,
    growth: null,
    leisure: null,
    relationship: null,
  });
  const [reason, setReason] = useState('');
  const [action, setAction] = useState('');

  const step = ACTION_STEPS[stepIndex];

  const isNextDisabled = () => {
    if (stepIndex === 0) return !selectedValue;
    if (stepIndex === 1) return reason.trim().length === 0;
    if (stepIndex === 2) return action.trim().length === 0;
    return false;
  };

  const handleSelectValue = (key: keyof Value, value: number) => {
    setSelectedValue({
      ...selectedValue,
      [key]: value,
    });
  };

  const handleReasonChange = (text: string) => {
    setReason(text);
  };

  const handleActionChange = (text: string) => {
    setAction(text);
  };

  const handleNext = () => {
    if (stepIndex < STEP_COUNT - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      // 마지막 스텝에서는 데이터 전송
      console.log(selectedValue);
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
        data: {
          value: selectedValue,
          reason,
          action,
        },
      });
    }
  };

  const handleExit = () => {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'HOME',
    });
  };

  const handlePrevStep = (currentStepIndex: number) => {
    if (currentStepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    } else {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
        action: 'BACK',
      });
    }
  };

  return {
    step,
    stepIndex,
    selectedValue,
    reason,
    action,
    isNextDisabled: isNextDisabled(),
    handleSelectValue,
    handleReasonChange,
    handleActionChange,
    handleNext,
    handleExit,
    handlePrevStep,
  };
}
