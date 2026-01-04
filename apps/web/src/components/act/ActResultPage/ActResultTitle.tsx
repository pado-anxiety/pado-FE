'use client';

import { Text } from '@pado/ui';

interface ActResultTitleProps {
  title: string[];
}

function ActResultTitle({ title }: ActResultTitleProps) {
  return (
    <div className="flex flex-col">
      {title.map((line, index) => (
        <Text
          key={`${line + index}`}
          className="text-title-medium"
        >
          {line}
        </Text>
      ))}
    </div>
  );
}

export default ActResultTitle;
