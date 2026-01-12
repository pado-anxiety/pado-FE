import { ChevronLeft, X } from 'lucide-react';

type NavButtonVariant = 'back' | 'close' | 'chevron';
type NavButtonSize = 'large' | 'small';

interface NavButtonProps {
  variant: NavButtonVariant;
  size?: NavButtonSize;
  color?: string;
  onClick?: () => void;
}

const ICON_SIZES = {
  large: 30,
  small: 24,
} as const;

export function NavButton({
  variant,
  size = 'large',
  color = 'black',
  onClick,
}: NavButtonProps) {
  const iconSize = ICON_SIZES[size];

  const renderIcon = () => {
    switch (variant) {
      case 'back':
        return (
          <ChevronLeft
            size={iconSize}
            color={color}
          />
        );
      case 'close':
        return (
          <X
            size={iconSize}
            color={color}
          />
        );
      case 'chevron':
        return (
          <ChevronLeft
            size={iconSize}
            color={color}
          />
        );
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center"
    >
      {renderIcon()}
    </button>
  );
}
