'use client';

import { Text } from '@pado/ui';

interface DescriptionListProps {
  items: string[];
  textClassName?: string;
  className?: string;
}

export function DescriptionList({
  items,
  textClassName,
  className,
}: DescriptionListProps) {
  return (
    <div className={`flex flex-col gap-4 ${className ?? ''}`.trim()}>
      {items.map((item, index) => (
        <Text
          key={index}
          className={textClassName ?? 'text-body-medium'}
        >
          {item}
        </Text>
      ))}
    </div>
  );
}
