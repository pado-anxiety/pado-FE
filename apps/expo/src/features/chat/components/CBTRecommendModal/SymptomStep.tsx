import { Pressable, Text, View } from '@src/components/ui';

import { CBT_MODAL_MESSAGES } from '../../constants';
import { SYMPTOM_OPTIONS, SymptomType } from '../../types';
import StepLayout from './StepLayout';

interface SymptomStepProps {
  selectedSymptom: SymptomType;
  onSelect: (symptom: SymptomType) => void;
}

export default function SymptomStep({
  selectedSymptom,
  onSelect,
}: SymptomStepProps) {
  return (
    <StepLayout title={CBT_MODAL_MESSAGES.STEP.SYMPTOM.TITLE}>
      <View className="flex flex-col gap-3">
        {SYMPTOM_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`rounded-2xl border-[1.5px] px-5 py-4 ${
              selectedSymptom === option.value
                ? 'border-neutral-650 bg-neutral-600'
                : 'border-neutral-300 bg-neutral-100'
            }`}
          >
            <Text
              className={`text-center text-body-medium ${
                selectedSymptom === option.value
                  ? 'font-semibold text-white'
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
