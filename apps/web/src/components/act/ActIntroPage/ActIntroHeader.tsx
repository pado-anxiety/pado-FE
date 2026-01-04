'use client';

import { Button, Text } from '@pado/ui';
import { X } from 'lucide-react';

interface ActIntroHeaderProps {
  title: string;
  onClose: () => void;
}

function ActIntroHeader({ title, onClose }: ActIntroHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <Text className="text-title-medium">{title}</Text>
      <Button
        size="sm"
        color="link"
        onClick={onClose}
        className="p-0"
      >
        <X
          size={30}
          color="black"
        />
      </Button>
    </div>
  );
}

export default ActIntroHeader;
