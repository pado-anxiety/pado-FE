import { Pressable, Text, View } from '@src/components/ui';

import StepLayout from './StepLayout';
import { SYMPTOM_OPTIONS, SymptomType } from './types';

interface SymptomStepProps {
  selectedSymptom: SymptomType;
  onSelect: (symptom: SymptomType) => void;
}

export default function SymptomStep({
  selectedSymptom,
  onSelect,
}: SymptomStepProps) {
  return (
    <StepLayout
      title={`지금 혹시 숨쉬기가 힘들거나\n몸이 제멋대로 반응하고 있어?`}
    >
      <View className="flex flex-col gap-3">
        {SYMPTOM_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`py-4 px-5 rounded-2xl border-[1.5px] ${
              selectedSymptom === option.value
                ? 'bg-neutral-600 border-neutral-650'
                : 'bg-neutral-100 border-neutral-300'
            }`}
          >
            <Text
              className={`text-body-medium text-center ${
                selectedSymptom === option.value
                  ? 'text-white font-semibold'
                  : 'text-neutral-900'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </StepLayout>
  );
}
