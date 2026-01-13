'use client';

import { Text } from '@pado/ui';

interface ActIntroDescriptionProps {
  description: string[];
}

function ActIntroDescription({ description }: ActIntroDescriptionProps) {
  return (
    <div className="flex flex-col gap-4">
      {description.map((desc) => (
        <Text
          key={desc}
          className="text-body-small"
        >
          {desc}
        </Text>
      ))}
    </div>
  );
}

export default ActIntroDescription;
