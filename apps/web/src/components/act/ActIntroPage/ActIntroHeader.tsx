'use client';

import { X } from 'lucide-react';

import { Button, Text } from '@pado/ui';

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
