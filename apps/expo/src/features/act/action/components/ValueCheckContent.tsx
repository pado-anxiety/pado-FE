import { Text, View } from '@src/components/ui';

import type { Value } from '../types';
import { ValueCircle } from './ValueCircle';

interface ValueCheckContentProps {
  title: string;
  description: string;
  selectedValue: Value;
  onSelectValue: (key: keyof Value, value: number) => void;
}

export function ValueCheckContent({
  title,
  description,
  selectedValue,
  onSelectValue,
}: ValueCheckContentProps) {
  return (
    <View className="flex-1 gap-4">
      <View className="gap-2">
        <Text
          preset="heading"
          bold
        >
          {title}
        </Text>
        <Text
          preset="body"
          className="text-sub"
        >
          {description}
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <ValueCircle
          selectedValue={selectedValue}
          onSelectValue={onSelectValue}
        />
      </View>
    </View>
  );
}
