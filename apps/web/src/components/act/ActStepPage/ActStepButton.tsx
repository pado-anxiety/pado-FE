'use client';

import { Button } from '@pado/ui';

interface ActStepButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function ActStepButton({ text, onClick, disabled }: ActStepButtonProps) {
  return (
    <Button
      size="default"
      text={text}
      onClick={onClick}
      disabled={disabled}
      className="bg-btn-act-page"
    />
  );
}

export default ActStepButton;
