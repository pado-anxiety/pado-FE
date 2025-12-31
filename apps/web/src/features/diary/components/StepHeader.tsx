import { Button } from '@pado/ui';

import { STEP_COUNT } from '../constants';
import { StepProgress } from './StepProgress';

type StepHeaderProps = {
  currentStepIndex: number;
  onExit: () => void;
  onNext: () => void;
};

export function StepHeader({
  currentStepIndex,
  onExit,
  onNext,
}: StepHeaderProps) {
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <Button
        size="default"
        text="나가기"
        onClick={onExit}
      />
      <StepProgress
        stepCount={STEP_COUNT}
        currentStepIndex={currentStepIndex}
      />
      <Button
        size="default"
        text="다음"
        onClick={onNext}
      />
    </div>
  );
}
