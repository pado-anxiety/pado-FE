import { Entypo, Feather } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';

type NavButtonVariant = 'back' | 'close' | 'chevron' | 'right';
type NavButtonSize = 'large' | 'small';

interface NavButtonProps {
  variant: NavButtonVariant;
  size?: NavButtonSize;
  color?: string;
  onPress?: () => void;
}

const ICON_SIZES = {
  large: 28,
  small: 20,
} as const;

export function NavButton({
  variant,
  size = 'large',
  color = 'black',
  onPress,
}: NavButtonProps) {
  const iconSize = scale(ICON_SIZES[size]);

  const renderIcon = () => {
    switch (variant) {
      case 'back':
        return (
          <Feather
            name="chevron-left"
            size={iconSize}
            color={color}
          />
        );
      case 'close':
        return (
          <Feather
            name="x"
            size={iconSize}
            color={color}
          />
        );
      case 'right':
        return (
          <Feather
            name="chevron-right"
            size={iconSize}
            color={color}
          />
        );
      case 'chevron':
        return (
          <Entypo
            name="chevron-thin-left"
            size={iconSize}
            color={color}
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
    >
      {renderIcon()}
    </Pressable>
  );
}
