import { RefObject } from 'react';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

import colors from '@pado/tailwind-design-tokens/colors';

import { Modal, Pressable, Text, View } from '@src/components/ui';

import { CBT_MODAL_MESSAGES, CBT_STEP, CBT_STEPS } from '../../constants';
import { useCBTStep } from '../../hooks';
import { CBTSelections } from '../../types';
import IntensityStep from './IntensityStep';
import SymptomStep from './SymptomStep';
import TriggerStep from './TriggerStep';

interface CBTRecommendModalProps {
  modalRef: RefObject<BottomSheetModal | null>;
  onComplete: (selections: CBTSelections) => void;
}

export default function CBTRecommendModal({
  modalRef,
  onComplete,
}: CBTRecommendModalProps) {
  const {
    currentStep,
    selections,
    isNextDisabled,
    isLastStep,
    nextStep,
    reset,
    setSymptom,
    setIntensity,
    setTrigger,
  } = useCBTStep(onComplete);

  const handleNext = () => {
    const completed = nextStep();
    if (completed) {
      modalRef.current?.dismiss();
      reset();
    }
  };

  return (
    <Modal
      ref={modalRef}
      backgroundStyle={{ backgroundColor: colors.neutral[200] }}
      handleIndicatorStyle={{ backgroundColor: 'transparent' }}
      onDismiss={reset}
    >
      <BottomSheetView className="px-5 pb-14 pt-2">
        {/* 스텝 인디케이터 */}
        <View className="mb-5 flex flex-row justify-center gap-2">
          {CBT_STEPS.map((step) => (
            <View
              key={step}
              className={`h-2 w-2 rounded-full ${
                step === currentStep ? 'bg-neutral-600' : 'bg-neutral-400'
              }`}
            />
          ))}
        </View>

        {/* 스텝별 컴포넌트 */}
        {currentStep === CBT_STEP.SYMPTOM && (
          <SymptomStep
            selectedSymptom={selections.symptom}
            onSelect={setSymptom}
          />
        )}
        {currentStep === CBT_STEP.INTENSITY && (
          <IntensityStep
            symptom={selections.symptom}
            intensity={selections.intensity}
            onIntensityChange={setIntensity}
          />
        )}
        {currentStep === CBT_STEP.TRIGGER && (
          <TriggerStep
            selectedTrigger={selections.trigger}
            onSelect={setTrigger}
          />
        )}

        {/* 하단 버튼 */}
        <View className="mt-6 flex flex-row items-center justify-between">
          <Pressable
            onPress={handleNext}
            disabled={isNextDisabled}
            className="flex-1 items-center justify-center rounded-2xl py-4"
          >
            <Text
              className={`text-body-medium font-semibold ${
                isNextDisabled ? 'opacity-20' : 'opacity-100'
              }`}
            >
              {isLastStep
                ? CBT_MODAL_MESSAGES.BUTTON.COMPLETE
                : CBT_MODAL_MESSAGES.BUTTON.NEXT}
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </Modal>
  );
}
