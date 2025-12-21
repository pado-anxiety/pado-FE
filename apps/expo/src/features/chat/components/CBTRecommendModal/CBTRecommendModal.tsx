import { RefObject, useCallback, useState } from 'react';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Modal, Pressable, Text, View } from '@src/components/ui';

import colors from '@nyangtodac/tailwind-design-tokens/colors';

import {
  CBTSelections,
  IntensityLevel,
  SymptomType,
  TriggerType,
  initialSelections,
} from '../../types';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] =
    useState<CBTSelections>(initialSelections);

  const resetAndClose = useCallback(() => {
    setCurrentStep(1);
    setSelections(initialSelections);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(selections);
      modalRef.current?.dismiss();
      resetAndClose();
    }
  }, [currentStep, onComplete, modalRef, resetAndClose, selections]);

  const setSymptom = useCallback((symptom: SymptomType) => {
    setSelections((prev) => ({ ...prev, symptom }));
  }, []);

  const setIntensity = useCallback((intensity: IntensityLevel) => {
    setSelections((prev) => ({ ...prev, intensity }));
  }, []);

  const setTrigger = useCallback((trigger: TriggerType) => {
    setSelections((prev) => ({ ...prev, trigger }));
  }, []);

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return selections.symptom === null;
      case 2:
        return false;
      case 3:
        return selections.trigger === null;
      default:
        return true;
    }
  };

  const getButtonText = () => {
    if (currentStep === 3) return '선택완료';
    return '다음';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SymptomStep
            selectedSymptom={selections.symptom}
            onSelect={setSymptom}
          />
        );
      case 2:
        return (
          <IntensityStep
            symptom={selections.symptom}
            intensity={selections.intensity}
            onIntensityChange={setIntensity}
          />
        );
      case 3:
        return (
          <TriggerStep
            selectedTrigger={selections.trigger}
            onSelect={setTrigger}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      ref={modalRef}
      backgroundStyle={{ backgroundColor: colors.neutral[200] }}
      handleIndicatorStyle={{ backgroundColor: 'transparent' }}
      onDismiss={resetAndClose}
    >
      <BottomSheetView className="px-5 pt-2 pb-14">
        {/* 스텝 인디케이터 */}
        <View className="flex flex-row justify-center gap-2 mb-5">
          {[1, 2, 3].map((step) => (
            <View
              key={step}
              className={`w-2 h-2 rounded-full ${
                step === currentStep ? 'bg-neutral-600' : 'bg-neutral-400'
              }`}
            />
          ))}
        </View>

        {/* 스텝 내용 */}
        {renderStep()}

        {/* 하단 버튼 영역 */}
        <View className="flex flex-row items-center justify-between mt-6">
          <Pressable
            onPress={handleNext}
            disabled={isNextDisabled()}
            className="flex-1 py-4 rounded-2xl items-center justify-center"
          >
            <Text
              className={`text-body-medium font-semibold ${
                isNextDisabled() ? 'opacity-20' : 'opacity-100'
              }`}
            >
              {getButtonText()}
            </Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </Modal>
  );
}
