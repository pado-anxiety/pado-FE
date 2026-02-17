import { Pressable } from 'react-native';

import { LoadingSpinner, View } from '@src/components/ui';
import { HistoryModalContent } from '@src/features/history';
import { ActHistory } from '@src/features/history/types';

interface HistoryDetailModalProps {
  detail: ActHistory | null;
  date: string;
  onClose: () => void;
}

export function HistoryDetailModal({
  detail,
  date,
  onClose,
}: HistoryDetailModalProps) {
  return (
    <Pressable
      onPress={onClose}
      className="absolute inset-0 items-center justify-center bg-black/80 px-8 py-48"
    >
      <Pressable
        onPress={(e) => e.stopPropagation()}
        className="w-full "
      >
        <View className="w-full rounded-3xl bg-act-page ">
          <View className="p-8">
            {detail ? (
              <HistoryModalContent
                data={detail}
                date={date}
              />
            ) : (
              <View className="items-center justify-center py-10">
                <LoadingSpinner />
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
}
