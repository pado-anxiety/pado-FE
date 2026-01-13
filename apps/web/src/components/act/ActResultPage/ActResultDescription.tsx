'use client';

import { Text } from '@pado/ui';

interface ActResultDescriptionProps {
  description: string[];
}

function ActResultDescription({ description }: ActResultDescriptionProps) {
  return (
    <div className="flex flex-col gap-4">
      {description.map((sentence, index) => (
        <Text
          key={index}
          className="text-body-medium font-normal"
        >
          {sentence}
        </Text>
      ))}
    </div>
  );
}

export default ActResultDescription;
