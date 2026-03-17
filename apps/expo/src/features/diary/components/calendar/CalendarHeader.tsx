import { NavButton, View } from '@src/components/ui';

interface CalendarHeaderProps {
  onBack: () => void;
}

export function CalendarHeader({ onBack }: CalendarHeaderProps) {
  return (
    <View className="px-6">
      <View style={{ marginLeft: -6 }}>
        <NavButton
          variant="back"
          color="#fff"
          onPress={onBack}
        />
      </View>
    </View>
  );
}
