import { RefObject } from 'react';

import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const title = t(`${step.i18nKey}.title`, { returnObjects: true }) as string[];

  if (stepIndex === 0) {
    return (
      <div className="flex flex-1 flex-col w-full gap-4">
        <div className="flex flex-col gap-2">
          <Text className="text-title-medium">
            {title.map((line, index) => (
              <span key={index}>
                {line}
                {index < title.length - 1 && <br />}
              </span>
            ))}
          </Text>
          <Text className="text-body-medium">
            {t(`${step.i18nKey}.description`)}
          </Text>
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
          {title.map((line, index) => (
            <span key={index}>
              {line}
              {index < title.length - 1 && <br />}
            </span>
          ))}
        </Text>
        <Text className="text-body-medium">
          {t(`${step.i18nKey}.description`)}
        </Text>
        <TokenSelector
          userTextTokens={userTextTokens}
          setUserTextTokens={setUserTextTokens}
        />
      </div>
    </div>
  );
}
