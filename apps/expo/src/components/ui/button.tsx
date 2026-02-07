import { useMemo } from 'react';

import { ActivityIndicator, Pressable } from 'react-native';
import type { PressableProps, View } from 'react-native';

import { buttonStyles } from '@pado/ui';
import type { ButtonVariants } from '@pado/ui';

import { Text } from './text';
import type { FontSize, FontWeight } from './text';

/** Apple HIG 기준 버튼 텍스트 크기 */
const BUTTON_TEXT_SIZE: Record<string, FontSize> = {
  sm: 'label-small',
  default: 'label-medium',
  lg: 'body-medium',
};

interface ButtonProps extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  /** 단일 텍스트. children과 함께 사용 시 children 우선 */
  text?: string;
  /** 텍스트 크기 (기본: 버튼 size에 따라 자동) */
  textSize?: FontSize;
  /** 텍스트 굵기 (기본: bold) */
  textWeight?: FontWeight;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  ref?: React.Ref<View>;
}

export function Button({
  text = '',
  textSize,
  textWeight = 'bold',
  isLoading = false,
  className = '',
  textClassName = '',
  color = 'primary',
  size = 'default',
  disabled = false,
  fullWidth = true,
  testID,
  ref,
  ...props
}: ButtonProps) {
  const styles = useMemo(
    () => buttonStyles({ color, size, disabled, fullWidth }),
    [color, size, disabled, fullWidth],
  );

  const resolvedTextSize = textSize ?? BUTTON_TEXT_SIZE[size ?? 'default'];

  return (
    <Pressable
      {...props}
      disabled={isLoading || disabled}
      ref={ref}
      testID={testID}
      className={styles.container({ className })}
    >
      {props.children ? (
        props.children
      ) : (
        <>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              testID={`${testID}-activity-indicator`}
              className={styles.indicator()}
            />
          ) : (
            <Text
              testID={`${testID}-text`}
              weight={textWeight}
              size={resolvedTextSize}
              className={styles.label({ className: textClassName })}
            >
              {text}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}
