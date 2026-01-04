'use client';

import { Button } from '@pado/ui';

interface ActIntroButtonProps {
  buttonText: string;
  onStart: () => void;
}

function ActIntroButton({ buttonText, onStart }: ActIntroButtonProps) {
  return (
    <Button
      size="default"
      text={buttonText}
      onClick={onStart}
      className="bg-btn-act-page"
    />
  );
}

export default ActIntroButton;
