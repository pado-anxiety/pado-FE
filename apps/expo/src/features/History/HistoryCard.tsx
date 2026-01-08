import { scale } from 'react-native-size-matters';

import { Text, View } from '@src/components/ui';

import { HistoryItemWithIndex } from '../home';

type HistoryCardProps = {
  item: HistoryItemWithIndex;
  totalLength: number;
  hasNext: boolean;
};

export default function HistoryCard({
  item,
  totalLength,
  hasNext,
}: HistoryCardProps) {
  return (
    <View
      className="w-full self-start bg-[#003366] px-8 py-4"
      style={{
        paddingBottom:
          item.index === totalLength - 1 && !hasNext ? scale(100) : 0,
      }}
    >
      <View className="rounded-lg bg-[#77AADD] p-4">
        <Text className="text-body-small">{item.content.type}</Text>
        <Text className="text-black">{item.content.time}</Text>
      </View>
    </View>
  );
}
