import { useColorScheme } from 'nativewind';
import { TextInput } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text, View } from '@src/components/ui';

import { ACT_TEXT_INPUT_STYLE } from '../../constants';

interface TextInputContentProps {
  title: string;
  description: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}

export function TextInputContent({
  title,
  description,
  value,
  onChange,
  placeholder,
}: TextInputContentProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  return (
    <View className="flex-1 gap-4">
      <View className="gap-2">
        <Text
          preset="heading"
          bold
        >
          {title}
        </Text>
        <Text
          preset="body"
          className="text-sub"
        >
          {description}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={tokens['--act-input-placeholder']}
        multiline
        className="flex-1 rounded-2xl border border-white bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
        style={{
          ...ACT_TEXT_INPUT_STYLE,
          color: tokens['--text-primary'],
        }}
      />
    </View>
  );
}
