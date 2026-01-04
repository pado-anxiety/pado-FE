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
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
      <div className="flex flex-1 flex-col w-full gap-4">
        <div className="flex flex-col gap-2">
          <Text className="text-title-medium">
            {step.title.map((line, index) => (
              <span key={index}>
                {line}
                {index < step.title.length - 1 && <br />}
              </span>
            ))}
          </Text>
          <Text className="text-body-medium">{step.description}</Text>
        </div>
        <TextInputArea
          textareaRef={textareaRef}
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full gap-4 justify-between">
      <div className="flex flex-col gap-2">
        <Text className="text-title-medium">
          {step.title.map((line, index) => (
            <span key={index}>
              {line}
              {index < step.title.length - 1 && <br />}
            </span>
          ))}
        </Text>
        <Text className="text-body-medium">{step.description}</Text>
        <TokenSelector
          userTextTokens={userTextTokens}
          setUserTextTokens={setUserTextTokens}
        />
      </div>
    </div>
  );
}
