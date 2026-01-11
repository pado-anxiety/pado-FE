import { useMemo, useState } from 'react';

import { WEBVIEW_MESSAGE_TYPE } from '@pado/bridge';

import { handlePostMessage } from '@/lib';

import { STEP_COUNT } from '../constants';

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
  const [selectedDomain, setSelectedDomain] = useState<keyof Value>('work');
  const [orientation, setOrientation] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [action, setAction] = useState('');

  const lowestDomains = useMemo((): (keyof Value)[] => {
    const entries = Object.entries(selectedValue) as [
      keyof Value,
      number | null,
    ][];
    const validEntries = entries.filter(
      (entry): entry is [keyof Value, number] => entry[1] !== null,
    );

    if (validEntries.length === 0) return [];

    const minScore = Math.min(...validEntries.map(([, value]) => value));

    return validEntries
      .filter(([, value]) => value === minScore)
      .map(([key]) => key);
  }, [selectedValue]);

  const isNextDisabled = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return Object.values(selectedValue).some((v) => v === null);
      case 1:
        return orientation.trim().length === 0;
      case 2:
        return obstacle.trim().length === 0;
      case 3:
        return action.trim().length === 0;
      default:
        return false;
    }
  }, [stepIndex, selectedValue, orientation, obstacle, action]);

  const handleSelectValue = (key: keyof Value, value: number) => {
    setSelectedValue((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      if (lowestDomains.length > 0) {
        setSelectedDomain(lowestDomains[0]);
      }
      setStepIndex((prev) => prev + 1);
    } else if (stepIndex < STEP_COUNT - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
        data: {
          selectedValue,
          selectedDomain,
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
    stepIndex,
    selectedValue,
    selectedDomain,
    lowestDomains,
    orientation,
    obstacle,
    action,
    isNextDisabled,
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
