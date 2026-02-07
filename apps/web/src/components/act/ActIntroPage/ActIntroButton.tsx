'use client';

import { Button } from '@/components/ui/Button';

import { triggerHaptic } from '@/lib/haptic';

interface ActIntroButtonProps {
  buttonText: string;
  onStart: () => void;
}

function ActIntroButton({ buttonText, onStart }: ActIntroButtonProps) {
  const handleStart = () => {
    triggerHaptic('NAVIGATE');
    onStart();
  };

  return (
    <Button
      size="default"
      text={buttonText}
      onClick={handleStart}
      className="bg-btn-act-page"
    />
  );
}

export default ActIntroButton;
