'use client';

import { Text } from '@pado/ui';

interface ActIntroDescriptionProps {
  description: string[];
}

function ActIntroDescription({ description }: ActIntroDescriptionProps) {
  return (
    <>
      {description.map((desc) => (
        <Text
          key={desc}
          className="text-body-small"
        >
          {desc}
        </Text>
      ))}
    </>
  );
}

export default ActIntroDescription;
