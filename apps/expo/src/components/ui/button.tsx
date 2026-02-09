import { useMemo } from 'react';

import { ActivityIndicator, Pressable } from 'react-native';
import type { PressableProps, View } from 'react-native';

import { buttonStyles } from '@pado/ui';
import type { ButtonVariants } from '@pado/ui';

import { Text } from './text';
import type { TextPreset } from './text';

/** Apple HIG 기준 버튼 텍스트 프리셋 */
const BUTTON_TEXT_PRESET: Record<string, TextPreset> = {
  sm: 'sub',
  default: 'body',
  lg: 'heading',
};

interface ButtonProps extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  /** 단일 텍스트. children과 함께 사용 시 children 우선 */
  text?: string;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
  ref?: React.Ref<View>;
}

export function Button({
  text = '',
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

  const resolvedPreset = BUTTON_TEXT_PRESET[size ?? 'default'];

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
              preset={resolvedPreset}
              bold
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
