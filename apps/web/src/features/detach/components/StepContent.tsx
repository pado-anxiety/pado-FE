import { RefObject } from 'react';

import { Text } from '@pado/ui';

import { DetachStep, UserTextToken } from '../types';
import { TextInputArea } from './TextInputArea';
import { TokenSelector } from './TokenSelector';

type StepContentProps = {
  step: DetachStep;
  stepIndex: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  userTextTokens: UserTextToken[];
  setUserTextTokens: React.Dispatch<React.SetStateAction<UserTextToken[]>>;
  handleChange: () => void;
};

export function StepContent({
  step,
  stepIndex,
  textareaRef,
  userTextTokens,
  setUserTextTokens,
  handleChange,
}: StepContentProps) {
  if (stepIndex === 0) {
    return (
      <div className="flex flex-1 flex-col w-full gap-2">
        <Text className="text-title-medium">{step.title}</Text>
        <Text className="text-body-medium">{step.description}</Text>
        <TextInputArea
          textareaRef={textareaRef}
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full gap-2">
      <div>
        <Text className="text-title-medium">{step.title}</Text>
      </div>
      <Text className="text-body-medium">{step.description}</Text>
      <TokenSelector
        userTextTokens={userTextTokens}
        setUserTextTokens={setUserTextTokens}
      />
    </div>
  );
}
