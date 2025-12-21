import Slider from '@react-native-community/slider';
import { Text, View } from '@src/components/ui';

import colors from '@nyangtodac/tailwind-design-tokens/colors';

import StepLayout from './StepLayout';
import {
  INTENSITY_LABELS,
  INTENSITY_LEVELS,
  IntensityLevel,
  SymptomType,
} from './types';

interface IntensityStepProps {
  symptom: SymptomType;
  intensity: IntensityLevel;
  onIntensityChange: (intensity: IntensityLevel) => void;
}

export default function IntensityStep({
  symptom,
  intensity,
  onIntensityChange,
}: IntensityStepProps) {
  const title =
    symptom === 'BODY'
      ? '몸이 견디기 얼마나 힘든 상태야?'
      : '그 마음의 무게가 어느 정도야?';

  const subtitle = symptom ? INTENSITY_LABELS[symptom][intensity] : '';

  const handleSliderChange = (value: number) => {
    const roundedValue = Math.round(value) as IntensityLevel;
    if (roundedValue !== intensity) {
      onIntensityChange(roundedValue);
    }
  };

  return (
    <StepLayout
      title={title}
      subtitle={subtitle}
    >
      <View className="items-center mt-4 w-full px-2">
        <Slider
          style={{ width: '100%', height: 50 }}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={intensity}
          onValueChange={handleSliderChange}
          minimumTrackTintColor={colors.neutral[600]}
          maximumTrackTintColor={colors.neutral[300]}
          thumbTintColor={colors.neutral[700]}
        />

        <View className="flex-row justify-between w-full px-3 mt-2">
          {INTENSITY_LEVELS.map((level) => (
            <Text
              key={level}
              className={`text-body-medium font-medium ${
                level === intensity ? 'text-neutral-900' : 'text-neutral-500'
              }`}
            >
              {level}
            </Text>
          ))}
        </View>

        <View className="flex-row justify-between w-full mt-3 px-1">
          <Text className="text-body-medium text-neutral-650">가벼움</Text>
          <Text className="text-body-medium text-neutral-650">무거움</Text>
        </View>
      </View>
    </StepLayout>
  );
}
