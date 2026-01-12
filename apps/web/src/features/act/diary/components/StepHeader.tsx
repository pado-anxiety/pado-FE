import { NavButton } from '@/components/ui';

type StepHeaderProps = {
  onExit: () => void;
};

export function StepHeader({ onExit }: StepHeaderProps) {
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <NavButton
        variant="close"
        size="large"
        onClick={onExit}
      />
    </div>
  );
}
