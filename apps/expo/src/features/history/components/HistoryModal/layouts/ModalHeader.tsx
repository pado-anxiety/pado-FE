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
        <Text preset="heading" bold>{title}</Text>
        <Text preset="sub" className="text-sub">
          {formatToLocaleDate(date)}
        </Text>
      </View>
      <Divider />
    </View>
  );
}
