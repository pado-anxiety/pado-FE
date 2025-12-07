import type { PressableProps, View } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import type { button } from './styles';

export type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  text?: string;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  ref?: React.Ref<View>;
}

export interface ButtonWebProps extends ButtonVariants {
  text?: string;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  testID?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

