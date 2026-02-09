import { Text, View } from '@src/components/ui';

import type { UserTextToken } from '../types';

interface ResultDisplayProps {
  result: UserTextToken[];
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <View className="flex-row flex-wrap gap-1 rounded-2xl border border-white bg-white/60 p-4">
      {result.map((item, index) => (
        <Text
          key={`${item.text}-${index}`}
          preset="body"
          style={{ opacity: item.isSelected ? 0.3 : 1 }}
        >
          {item.text}
        </Text>
      ))}
    </View>
  );
}
