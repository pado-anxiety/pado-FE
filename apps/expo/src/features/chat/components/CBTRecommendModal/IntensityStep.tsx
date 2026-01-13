import Slider from '@react-native-community/slider';

import colors from '@pado/tailwind-design-tokens/colors';

import { Text, View } from '@src/components/ui';

import { CBT_MODAL_MESSAGES } from '../../constants';
import {
  INTENSITY_LABELS,
  INTENSITY_LEVELS,
  IntensityLevel,
  SymptomType,
} from '../../types';
import StepLayout from './StepLayout';

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
      ? CBT_MODAL_MESSAGES.STEP.INTENSITY.TITLE_BODY
      : CBT_MODAL_MESSAGES.STEP.INTENSITY.TITLE_MIND;

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
      <View className="mt-4 w-full items-center px-2">
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

        <View className="mt-2 w-full flex-row justify-between px-3">
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

        <View className="mt-3 w-full flex-row justify-between px-1">
          <Text className="text-body-medium text-neutral-650">
            {CBT_MODAL_MESSAGES.STEP.INTENSITY.SUBTITLE_LIGHT}
          </Text>
          <Text className="text-body-medium text-neutral-650">
            {CBT_MODAL_MESSAGES.STEP.INTENSITY.SUBTITLE_HEAVY}
          </Text>
        </View>
      </View>
    </StepLayout>
  );
}
