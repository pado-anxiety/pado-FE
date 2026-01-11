'use client';

interface ActStepHeaderProps {
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  className?: string;
}

function ActStepHeader({ leftButton, rightButton }: ActStepHeaderProps) {
  return (
    <div className="flex flex-row w-full justify-between">
      {leftButton || <div />}
      {rightButton || <div />}
    </div>
  );
}

export default ActStepHeader;
