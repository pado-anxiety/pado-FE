import { Divider, Text, View } from '@src/components/ui';
import { formatToKoreanDate } from '@src/lib/time';

interface ModalHeaderProps {
  title: string;
  date: string;
}

export function ModalHeader({ title, date }: ModalHeaderProps) {
  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-col gap-1">
        <Text className="text-body-large font-bold">{title}</Text>
        <Text className="text-body-medium text-blue-500">
          {formatToKoreanDate(date)}
        </Text>
      </View>
      <Divider />
    </View>
  );
}
