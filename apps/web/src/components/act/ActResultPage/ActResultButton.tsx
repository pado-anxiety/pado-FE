'use client';

import { Button } from '@pado/ui';

import { triggerHaptic } from '@/lib/haptic';

interface ActResultButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function ActResultButton({ text, onClick, disabled }: ActResultButtonProps) {
  const handleClick = () => {
    triggerHaptic('NAVIGATE');
    onClick();
  };

  return (
    <Button
      size="default"
      text={text}
      onClick={handleClick}
      disabled={disabled}
      className="bg-btn-act-page"
    />
  );
}

export default ActResultButton;
