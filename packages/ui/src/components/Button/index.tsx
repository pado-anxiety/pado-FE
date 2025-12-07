import { useMemo } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { button } from './styles';
import type { ButtonProps } from './type';

export default function Button({
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
    () => button({ color, size, disabled, fullWidth }),
    [color, size, disabled, fullWidth]
  );

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
              size='small'
              testID={`${testID}-activity-indicator`}
              className={styles.indicator()}
            />
          ) : (
            <Text testID={`${testID}-text`} className={styles.label({ className: textClassName })}>
              {text}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}
