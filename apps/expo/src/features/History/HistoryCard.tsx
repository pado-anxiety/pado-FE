import { Pressable, Text, View } from '@src/components/ui';

import { HistoryItemWithIndex } from '../home';
import { ACTType } from './types';

type HistoryCardProps = {
  item: HistoryItemWithIndex;
  handleModalOpen: (id: number, type: ACTType) => void;
};

export default function HistoryCard({
  item,
  handleModalOpen,
}: HistoryCardProps) {
  return (
    <Pressable
      onPress={() => {
        handleModalOpen(item.id, item.content.type);
      }}
      className="w-full self-start bg-[#003366] px-8 py-4"
    >
      <View className="rounded-lg bg-[#77AADD] p-4">
        <Text className="text-body-small">{item.content.type}</Text>
        <Text className="text-black">{item.content.time}</Text>
      </View>
    </Pressable>
  );
}
