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

  const getLowestDomains = (values: Value): string[] => {
    let minScore = Infinity;

    return Object.entries(values).reduce((acc: string[], [key, value]) => {
      // 값이 null인 경우는 진단되지 않은 것으로 간주하여 제외
      if (value === null) return acc;

      if (value < minScore) {
        // 새로운 최저점을 발견하면 기존 배열을 버리고 새 키를 담음
        minScore = value;
        return [key];
      } else if (value === minScore) {
        // 최저점과 동점이면 배열에 추가 (중복 허용)
        return [...acc, key];
      }

      return acc;
    }, []);
  };

  const [selectedDomain, setSelectedDomain] = useState<keyof Value>('work');
  const [orientation, setOrientation] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [action, setAction] = useState('');

  const step = ACTION_STEPS[stepIndex];

  const isNextDisabled = () => {
    if (stepIndex === 0)
      return Object.values(selectedValue).some((v) => v === null);
    if (stepIndex === 1) return orientation.trim().length === 0;
    if (stepIndex === 2) return obstacle.trim().length === 0;
    if (stepIndex === 3) return action.trim().length === 0;
    return false;
  };

  const handleSelectValue = (key: keyof Value, value: number) => {
    setSelectedValue({
      ...selectedValue,
      [key]: value,
    });
  };

  const handleSelectDomain = (domain: keyof Value) => {
    setSelectedDomain(domain);
  };

  const handleOrientationChange = (text: string) => {
    setOrientation(text);
  };

  const handleObstacleChange = (text: string) => {
    setObstacle(text);
  };

  const handleActionChange = (text: string) => {
    setAction(text);
  };

  const handleNext = () => {
    if (stepIndex === 0) {
      setSelectedDomain(getLowestDomains(selectedValue)[0] as keyof Value);
      setStepIndex((prev) => prev + 1);
    } else if (stepIndex < STEP_COUNT - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
        data: {
          value: selectedValue,
          orientation,
          obstacle,
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
    selectedDomain,
    orientation,
    obstacle,
    action,
    getLowestDomains,
    isNextDisabled: isNextDisabled(),
    handleSelectValue,
    handleSelectDomain,
    handleOrientationChange,
    handleObstacleChange,
    handleActionChange,
    handleNext,
    handleExit,
    handlePrevStep,
  };
}
