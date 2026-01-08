import { Pressable, Text, View } from '@src/components/ui';
import { formatToKoreanDate } from '@src/lib/time';

import { HistoryItemWithIndex } from '../home';
import { ACTType } from './types';

type HistoryCardProps = {
  item: HistoryItemWithIndex;
  handleModalOpen: (id: number, type: ACTType) => void;
};

const WORD = {
  CONTACT_WITH_PRESENT: '현재와의 접촉',
  EMOTION_NOTE: '감정 기록',
  COGNITIVE_DEFUSION: '인지 분리',
  ACCEPTANCE: '수용',
  VALUES: '가치 및 전념행동',
};

export default function HistoryCard({
  item,
  handleModalOpen,
}: HistoryCardProps) {
  return (
    <View className="bg-[#003366]">
      <View className="px-4 py-4">
        <View className="flex flex-row items-start justify-between gap-2">
          <View className="pt-1">
            <Text className="text-body-small font-bold text-white/60">
              {formatToKoreanDate(item.date)}
            </Text>
          </View>
          <View className="flex flex-1 flex-row flex-wrap gap-2">
            {item.items.map((el) => (
              <Pressable
                key={`${el.id}-${el.type}`}
                onPress={() => handleModalOpen(el.id, el.type)}
                className="rounded-full bg-white/10 px-3 py-1.5 active:bg-white/20"
              >
                <Text className="text-body-small text-white">
                  {WORD[el.type]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      <View className="h-[1px] w-full bg-white/20" />
    </View>
  );
}
