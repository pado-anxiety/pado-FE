'use client';

import { Text } from '@pado/ui';

interface ActIntroContentHeaderProps {
  title: string;
  description: string;
}

function ActIntroContentHeader({
  title,
  description,
}: ActIntroContentHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <Text className="text-body-medium font-bold">{title}</Text>
      <Text className="text-body-small text-sub">{description}</Text>
    </div>
  );
}

export default ActIntroContentHeader;
