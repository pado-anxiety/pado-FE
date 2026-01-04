'use client';

import { Button } from '@pado/ui';

interface ActResultButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function ActResultButton({ text, onClick, disabled }: ActResultButtonProps) {
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

export default ActResultButton;
