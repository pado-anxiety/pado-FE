'use client';

interface ActStepHeaderProps {
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  className?: string;
}

function ActStepHeader({ leftButton, rightButton }: ActStepHeaderProps) {
  return (
    <div className="flex flex-row w-full justify-between">
      <div style={{ marginLeft: -7 }}>{leftButton || <div />}</div>
      {rightButton || <div />}
    </div>
  );
}

export default ActStepHeader;
