import { Button } from '@pado/ui';

type StepHeaderProps = {
  onExit: () => void;
  onNext: () => void;
};

export function StepHeader({ onExit, onNext }: StepHeaderProps) {
  return (
    <div className="flex flex-row gap-2 w-full justify-between">
      <Button
        size="default"
        text="나가기"
        onClick={onExit}
      />
      <Button
        size="default"
        text="다음"
        onClick={onNext}
      />
    </div>
  );
}
