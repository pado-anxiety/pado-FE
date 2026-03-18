import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { Text } from '@src/components/ui';

import { STEP_COUNT, STEP_LABELS } from '../constants';

interface ProgressDotsProps {
  currentStep: number;
}

function getStepColor(
  stepIndex: number,
  currentStep: number,
  tokens: { completed: string; active: string; inactive: string },
): string {
  if (stepIndex < currentStep) return tokens.completed;
  if (stepIndex === currentStep) return tokens.active;
  return tokens.inactive;
}

export function ProgressDots({ currentStep }: ProgressDotsProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const accent = tokens['--btn-act-page'];

  const barColors = {
    completed: tokens['--text-tertiary'],
    active: accent,
    inactive: tokens['--border-default'],
  };
  const labelColors = {
    completed: tokens['--text-tertiary'],
    active: accent,
    inactive: tokens['--text-disabled'],
  };

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
              backgroundColor: getStepColor(i, currentStep, barColors),
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
              color: getStepColor(i, currentStep, labelColors),
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
