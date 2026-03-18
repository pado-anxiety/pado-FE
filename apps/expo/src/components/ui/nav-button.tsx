import { Entypo, Feather } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';

import { useIconColor } from '@src/lib/theme';

type NavButtonVariant = 'back' | 'close' | 'chevron' | 'right';
type NavButtonSize = 'large' | 'small';

interface NavButtonProps {
  variant: NavButtonVariant;
  size?: NavButtonSize;
  color?: string;
  onPress?: () => void;
  testID?: string;
}

const ICON_SIZES = {
  large: 28,
  small: 20,
} as const;

export function NavButton({
  variant,
  size = 'large',
  color,
  onPress,
  testID,
}: NavButtonProps) {
  const { iconPrimary } = useIconColor();
  const iconColor = color ?? iconPrimary;
  const iconSize = scale(ICON_SIZES[size]);

  const renderIcon = () => {
    switch (variant) {
      case 'back':
        return (
          <Feather
            name="chevron-left"
            size={iconSize}
            color={iconColor}
          />
        );
      case 'close':
        return (
          <Feather
            name="x"
            size={iconSize}
            color={iconColor}
          />
        );
      case 'right':
        return (
          <Feather
            name="chevron-right"
            size={iconSize}
            color={iconColor}
          />
        );
      case 'chevron':
        return (
          <Entypo
            name="chevron-thin-left"
            size={iconSize}
            color={iconColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      testID={testID ?? `nav-${variant}`}
    >
      {renderIcon()}
    </Pressable>
  );
}
