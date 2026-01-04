import { RefObject } from 'react';

import { Button, Text } from '@pado/ui';

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
  handleNext: () => void;
};

export function StepContent({
  step,
  stepIndex,
  textareaRef,
  userTextTokens,
  setUserTextTokens,
  handleChange,
  handleNext,
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
        <Button
          size="default"
          text="다음"
          onClick={handleNext}
          className="bg-btn-act-page"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col w-full gap-4 justify-between overflow-y-auto scrollbar-hide">
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
      <Button
        size="default"
        text="다음"
        onClick={handleNext}
        className="bg-btn-act-page"
      />
    </div>
  );
}
