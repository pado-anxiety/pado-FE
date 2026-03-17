import { RefObject } from 'react';

import { useColorScheme } from 'nativewind';
import { TextInput } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text, View } from '@src/components/ui';

import { MAX_CHAR_LIMIT } from '../../constants';
import { QuickChips } from '../EmotionChips';

interface TextStepProps {
  chips: readonly string[];
  chipsLabel: string;
  value: string;
  onChange: (text: string) => void;
  onChipSelect: (chip: string) => void;
  placeholder: string;
  inputRef?: RefObject<TextInput | null>;
}

export function TextStep({
  chips,
  chipsLabel,
  value,
  onChange,
  onChipSelect,
  placeholder,
  inputRef,
}: TextStepProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  return (
    <>
      <QuickChips
        chips={chips}
        onSelect={onChipSelect}
        label={chipsLabel}
      />
      <View style={{ flex: 1 }}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={tokens['--act-input-placeholder']}
          multiline
          maxLength={MAX_CHAR_LIMIT}
          className="flex-1 rounded-2xl border border-white bg-white/50 p-4 dark:border-white/10 dark:bg-white/5"
          style={{
            textAlignVertical: 'top',
            fontSize: 15,
            lineHeight: 24,
            fontFamily: 'Pretendard-Regular',
            color: tokens['--text-primary'],
          }}
        />
        <Text
          preset="caption"
          style={{
            position: 'absolute',
            bottom: 10,
            right: 14,
            color: tokens['--text-disabled'],
          }}
        >
          {value.length}/{MAX_CHAR_LIMIT}
        </Text>
      </View>
    </>
  );
}
