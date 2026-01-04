import { Button, Text } from '@pado/ui';
import { X } from 'lucide-react';

type StepHeaderProps = {
  onExit: () => void;
  onNext: () => void;
};

export function StepHeader({ onExit, onNext }: StepHeaderProps) {
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <X
        size={30}
        color="black"
        onClick={onExit}
      />
      <Button
        size="default"
        text="다음"
        onClick={onNext}
        className="p-0 bg-transparent"
      >
        <Text className="text-body-small">다음</Text>
      </Button>
    </div>
  );
}
