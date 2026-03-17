import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text } from '@src/components/ui';

import { STEP_COUNT, STEP_LABELS } from '../constants';

interface ProgressDotsProps {
  currentStep: number;
}

export function ProgressDots({ currentStep }: ProgressDotsProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const accent = tokens['--btn-act-page'];

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 10,
              backgroundColor:
                i < currentStep
                  ? tokens['--text-tertiary']
                  : i === currentStep
                    ? accent
                    : tokens['--border-default'],
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {STEP_LABELS.map((label, i) => (
          <Text
            key={i}
            preset="caption"
            style={{
              flex: 1,
              textAlign: 'center',
              color:
                i < currentStep
                  ? tokens['--text-tertiary']
                  : i === currentStep
                    ? accent
                    : tokens['--text-disabled'],
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
