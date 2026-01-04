'use client';

import { Text } from '@pado/ui';

interface ActResultTitleProps {
  title: string[];
}

function ActResultTitle({ title }: ActResultTitleProps) {
  return (
    <Text className="text-title-medium">
      {title.map((line, index) => (
        <span key={index}>
          {line}
          {index < title.length - 1 && <br />}
        </span>
      ))}
    </Text>
  );
}

export default ActResultTitle;
