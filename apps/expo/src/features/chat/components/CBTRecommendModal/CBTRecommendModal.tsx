import { RefObject } from 'react';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Modal, Pressable, Text, View } from '@src/components/ui';

import colors from '@pado/tailwind-design-tokens/colors';

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
      <BottomSheetView className="px-5 pt-2 pb-14">
        {/* 스텝 인디케이터 */}
        <View className="flex flex-row justify-center gap-2 mb-5">
          {CBT_STEPS.map((step) => (
            <View
              key={step}
              className={`w-2 h-2 rounded-full ${
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
        <View className="flex flex-row items-center justify-between mt-6">
          <Pressable
            onPress={handleNext}
            disabled={isNextDisabled}
            className="flex-1 py-4 rounded-2xl items-center justify-center"
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
