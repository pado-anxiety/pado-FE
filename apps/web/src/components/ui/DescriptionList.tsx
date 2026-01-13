'use client';

import { Text } from '@pado/ui';

interface DescriptionListProps {
  title?: string | string[];
  items: string[];
  titleClassName?: string;
  itemClassName?: string;
}

export function DescriptionList({
  title,
  items,
  titleClassName = 'text-title-medium',
  itemClassName = 'text-body-medium',
}: DescriptionListProps) {
  const renderTitle = () => {
    if (!title) return null;

    if (Array.isArray(title)) {
      return (
        <div className="flex flex-col">
          {title.map((line, index) => (
            <Text
              key={`${line}-${index}`}
              className={titleClassName}
            >
              {line}
            </Text>
          ))}
        </div>
      );
    }

    return <Text className={titleClassName}>{title}</Text>;
  };

  return (
    <div className="flex flex-col gap-3">
      {renderTitle()}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <Text
            key={`${item}-${index}`}
            className={itemClassName}
          >
            {item}
          </Text>
        ))}
      </div>
    </div>
  );
}
