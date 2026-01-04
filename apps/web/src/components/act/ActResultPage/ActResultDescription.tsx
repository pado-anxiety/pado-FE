'use client';

import { Text } from '@pado/ui';

interface ActResultDescriptionProps {
  description: string;
}

function ActResultDescription({ description }: ActResultDescriptionProps) {
  return (
    <Text className="text-body-medium font-normal">
      {description}
    </Text>
  );
}

export default ActResultDescription;
