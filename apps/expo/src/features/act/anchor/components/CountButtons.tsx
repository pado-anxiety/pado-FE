import { Pressable } from 'react-native';

import { Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';

interface CountButtonsProps {
  count: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function CountButtons({
  count,
  selectedIndex,
  onSelect,
}: CountButtonsProps) {
  const handleSelect = (index: number) => {
    triggerHaptic('SELECT');
    onSelect(index);
  };

  return (
    <View className="flex-row gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const buttonIndex = index + 1;
        const isSelected = index === selectedIndex;
        const isCompleted = index < selectedIndex;
        const isDisabled = index !== selectedIndex;

        return (
          <Pressable
            key={`count-${buttonIndex}`}
            onPress={() => handleSelect(buttonIndex)}
            disabled={isDisabled}
            style={{
              backgroundColor: isSelected ? '#2E476B' : '#B9CDE5',
              opacity: isCompleted ? 0.5 : 1,
              borderRadius: 16,
              padding: 16,
              minWidth: 44,
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              preset="body"
              bold
              style={{ color: isSelected ? '#FFFFFF' : '#000000' }}
            >
              {buttonIndex}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
