import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';

const BUTTON_BORDER_RADIUS = 16;
const BUTTON_PADDING = 16;
const BUTTON_MIN_SIZE = 44;

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
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

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
              backgroundColor: isSelected
                ? tokens['--btn-act-page-selected']
                : tokens['--btn-act-page-unselected'],
              opacity: isCompleted ? 0.5 : 1,
              borderRadius: BUTTON_BORDER_RADIUS,
              padding: BUTTON_PADDING,
              minWidth: BUTTON_MIN_SIZE,
              minHeight: BUTTON_MIN_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              preset="body"
              bold
              style={{
                color: isSelected
                  ? tokens['--text-inverse']
                  : tokens['--text-primary'],
              }}
            >
              {buttonIndex}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
