import { useCallback, useMemo, useState } from 'react';

import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import type { BlurEvent, TextInput } from 'react-native';
import {
  TextInput as NTextInput,
  Text,
  TextInputProps,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';
import { VariantProps, tv } from 'tailwind-variants';

const input = tv({
  slots: {
    container: 'grow',
    label: 'text-body text-lg',
    input:
      'mt-0 rounded-xl border border-solid border-primary px-4 py-3 font-inter text-base font-medium leading-5 text-body',
  },

  variants: {
    focused: {
      true: {
        input: 'border-neutral-400 dark:border-neutral-300',
      },
    },
    error: {
      true: {
        input: 'border-destructive dark:border-destructive-dark',
        label: 'text-destructive dark:text-destructive-dark',
      },
    },
    disabled: {
      true: {
        input: 'bg-neutral-200 opacity-50',
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

type InputVariants = VariantProps<typeof input>;

interface InputProps extends Omit<InputVariants, 'error'>, TextInputProps {
  label?: string;
  error?: string;
  ref?: React.Ref<TextInput>;
}

function Input({
  label,
  error,
  disabled,
  onBlur,
  className,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const styles = useMemo(
    () => input({ focused: isFocused, error: Boolean(error), disabled }),
    [isFocused, error, disabled],
  );

  const handleBlur = useCallback(
    (e: BlurEvent) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  return (
    <View className={styles.container()}>
      {label && <Text className={styles.label()}>{label}</Text>}
      <NTextInput
        {...props}
        className={twMerge(styles.input(), className)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {error && <Text className="text-destructive text-sm mt-1">{error}</Text>}
    </View>
  );
}

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

interface ControlledInputProps<T extends FieldValues> extends InputProps {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule<T>;
}

export default function ControlledInput<T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: ControlledInputProps<T>) {
  const { field, fieldState } = useController({ control, name, rules });

  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      value={(field.value as string) || ''}
      error={fieldState.error?.message}
      {...props}
    />
  );
}
