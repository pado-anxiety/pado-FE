import { useCallback, useMemo, useState } from 'react';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Modal, Pressable, Text, View } from '@src/components/ui';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import colors from '@nyangtodac/tailwind-design-tokens/colors';

// Types
type SymptomType = 'BODY' | 'MIND' | null;
type TriggerType =
  | 'PRESENTATION_EXAM'
  | 'RELATIONSHIP'
  | 'HEALTH_DEATH'
  | 'FUTURE_MONEY'
  | 'UNKNOWN'
  | null;

interface CBTSelections {
  symptom: SymptomType;
  intensity: number;
  trigger: TriggerType;
}

const initialSelections: CBTSelections = {
  symptom: null,
  intensity: 3,
  trigger: null,
};

// Mock Data
const SYMPTOM_OPTIONS: { value: SymptomType; label: string }[] = [
  { value: 'BODY', label: '응, 몸부터 진정시켜줘' },
  { value: 'MIND', label: '아니, 머릿속 생각들이 더 문제야' },
];

const INTENSITY_LEVELS = [1, 2, 3, 4, 5];
const INTENSITY_LABELS: Record<number, string> = {
  1: '조금',
  2: '약간',
  3: '보통',
  4: '심함',
  5: '매우 심함',
};

const TRIGGER_OPTIONS: { value: TriggerType; label: string }[] = [
  { value: 'PRESENTATION_EXAM', label: '발표/시험' },
  { value: 'RELATIONSHIP', label: '인간관계' },
  { value: 'HEALTH_DEATH', label: '건강/죽음' },
  { value: 'FUTURE_MONEY', label: '미래/돈' },
  { value: 'UNKNOWN', label: '이유모름' },
];

// Slider constants
const SLIDER_WIDTH = 280;
const THUMB_SIZE = 28;
const STEP_COUNT = 5;
const STEP_WIDTH = (SLIDER_WIDTH - THUMB_SIZE) / (STEP_COUNT - 1);

export default function CBTRecommendModal({
  ref,
}: {
  ref: React.Ref<BottomSheetModal>;
}) {
  const backgroundStyle = useMemo(
    () => ({ backgroundColor: colors.neutral[200] }),
    [],
  );
  const handleIndicatorStyle = useMemo(
    () => ({ backgroundColor: colors.neutral[400] }),
    [],
  );
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
      // 마지막 스텝에서 완료 처리
      console.log('CBT 선택 완료:', selections);
      resetAndClose();
    }
  }, [currentStep, selections, resetAndClose]);

  const setSymptom = useCallback((symptom: SymptomType) => {
    setSelections((prev) => ({ ...prev, symptom }));
  }, []);

  const setIntensity = useCallback((intensity: number) => {
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

  // Step 1: 증상 선택
  const renderStep1 = () => (
    <View className="flex flex-col gap-4">
      <Text className="text-body-large text-neutral-900 text-center font-medium leading-relaxed">
        지금 혹시 숨쉬기가 힘들거나{'\n'}몸이 제멋대로 반응하고 있어?
      </Text>
      <View className="flex flex-col gap-3 mt-2">
        {SYMPTOM_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setSymptom(option.value)}
            className={`py-4 px-5 rounded-2xl border-2 ${
              selections.symptom === option.value
                ? 'bg-neutral-600 border-neutral-700'
                : 'bg-neutral-100 border-neutral-300'
            }`}
          >
            <Text
              className={`text-body-medium text-center ${
                selections.symptom === option.value
                  ? 'text-white font-semibold'
                  : 'text-neutral-900'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  // Step 2: 강도 선택 (슬라이더)
  const sliderPosition = useSharedValue(
    (selections.intensity - 1) * STEP_WIDTH,
  );

  const updateIntensity = useCallback(
    (position: number) => {
      const step = Math.round(position / STEP_WIDTH) + 1;
      const clampedStep = Math.max(1, Math.min(5, step));
      if (clampedStep !== selections.intensity) {
        setIntensity(clampedStep);
      }
    },
    [selections.intensity, setIntensity],
  );

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newPosition = Math.max(
        0,
        Math.min(SLIDER_WIDTH - THUMB_SIZE, event.x - THUMB_SIZE / 2),
      );
      sliderPosition.value = newPosition;
      runOnJS(updateIntensity)(newPosition);
    })
    .onEnd(() => {
      const snappedStep = Math.round(sliderPosition.value / STEP_WIDTH);
      sliderPosition.value = snappedStep * STEP_WIDTH;
    });

  const tapGesture = Gesture.Tap().onEnd((event) => {
    const newPosition = Math.max(
      0,
      Math.min(SLIDER_WIDTH - THUMB_SIZE, event.x - THUMB_SIZE / 2),
    );
    const snappedStep = Math.round(newPosition / STEP_WIDTH);
    sliderPosition.value = snappedStep * STEP_WIDTH;
    runOnJS(updateIntensity)(snappedStep * STEP_WIDTH);
  });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderPosition.value }],
  }));

  const activeTrackStyle = useAnimatedStyle(() => ({
    width: sliderPosition.value + THUMB_SIZE / 2,
  }));

  const renderStep2 = () => (
    <View className="flex flex-col gap-4">
      <Text className="text-body-large text-neutral-900 text-center font-medium">
        지금 느끼는 불안의 강도는 어때?
      </Text>
      <Text className="text-body-small text-neutral-500 text-center">
        1부터 5까지, 숫자가 클수록 강해요
      </Text>

      {/* 슬라이더 */}
      <View className="items-center mt-6">
        <GestureDetector gesture={composedGesture}>
          <View
            style={{ width: SLIDER_WIDTH, height: 40 }}
            className="justify-center"
          >
            {/* 트랙 배경 */}
            <View
              style={{ width: SLIDER_WIDTH, height: 6 }}
              className="bg-neutral-300 rounded-full absolute"
            />
            {/* 활성 트랙 */}
            <Animated.View
              style={[{ height: 6 }, activeTrackStyle]}
              className="bg-neutral-600 rounded-full absolute"
            />
            {/* 스텝 점들 */}
            <View className="absolute flex-row justify-between w-full px-[10px]">
              {INTENSITY_LEVELS.map((level) => (
                <View
                  key={level}
                  className={`w-2 h-2 rounded-full ${
                    level <= selections.intensity
                      ? 'bg-neutral-700'
                      : 'bg-neutral-400'
                  }`}
                />
              ))}
            </View>
            {/* 썸 */}
            <Animated.View
              style={[
                {
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  position: 'absolute',
                },
                thumbStyle,
              ]}
              className="bg-white rounded-full border-2 border-neutral-600 shadow-md items-center justify-center"
            >
              <Text className="text-body-small font-bold text-neutral-700">
                {selections.intensity}
              </Text>
            </Animated.View>
          </View>
        </GestureDetector>

        {/* 라벨 */}
        <View className="flex-row justify-between w-full mt-3 px-1">
          <Text className="text-body-small text-neutral-500">조금</Text>
          <Text className="text-body-small text-neutral-500">매우 심함</Text>
        </View>

        {/* 선택된 강도 표시 */}
        <View className="items-center mt-4">
          <Text className="text-body-medium text-neutral-700 font-semibold">
            {INTENSITY_LABELS[selections.intensity]}
          </Text>
        </View>
      </View>
    </View>
  );

  // Step 3: 트리거 선택
  const renderStep3 = () => (
    <View className="flex flex-col gap-4">
      <Text className="text-body-large text-neutral-900 text-center font-medium">
        어떤 상황이 가장 힘들었어?
      </Text>
      <Text className="text-body-small text-neutral-500 text-center">
        하나를 선택해줘
      </Text>
      <View className="flex flex-row flex-wrap justify-center gap-3 mt-4">
        {TRIGGER_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setTrigger(option.value)}
            className={`py-3 px-5 rounded-full border-2 ${
              selections.trigger === option.value
                ? 'bg-primary-100 border-primary-500'
                : 'bg-white border-neutral-300'
            }`}
          >
            <Text
              className={`text-body-medium ${
                selections.trigger === option.value
                  ? 'text-primary-600 font-semibold'
                  : 'text-neutral-700'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <Modal
      ref={ref}
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={handleIndicatorStyle}
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
          {/* 선택완료/다음 버튼 */}
          <Pressable
            onPress={handleNext}
            disabled={isNextDisabled()}
            className="flex-1 py-4 rounded-2xl items-center justify-center"
          >
            <Text
              className={`text-body-medium font-semibold ${
                isNextDisabled() ? 'text-neutral-900' : 'text-black'
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
