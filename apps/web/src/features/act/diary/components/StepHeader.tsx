import { X } from 'lucide-react';

type StepHeaderProps = {
  onExit: () => void;
};

export function StepHeader({ onExit }: StepHeaderProps) {
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <X
        size={30}
        color="black"
        onClick={onExit}
      />
    </div>
  );
}
