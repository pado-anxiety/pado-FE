import { Divider, Text, View } from '@src/components/ui';
import { formatToLocaleDate } from '@src/lib/time';

interface ModalHeaderProps {
  title: string;
  date: string;
}

export function ModalHeader({ title, date }: ModalHeaderProps) {
  return (
    <View className="flex flex-col gap-2">
      <View className="flex flex-col">
        <Text className="text-body-medium font-bold">{title}</Text>
        <Text className="text-body-small text-sub">
          {formatToLocaleDate(date)}
        </Text>
      </View>
      <Divider />
    </View>
  );
}
