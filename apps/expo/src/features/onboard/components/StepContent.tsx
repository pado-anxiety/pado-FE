import { useEffect, useState } from 'react';

import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Button, Text, View } from '@src/components/ui';

// TODO: 버튼 텍스트 크기 조정
// TODO: 텍스트 및 애니메이션 fade in 시간 조정

import { ANIMATION } from '../constants';

interface StepContentProps {
  /** 표시할 텍스트 배열 */
  texts: string[];
  /** 버튼 텍스트 */
  buttonText: string;
  /** 다음 버튼 클릭 핸들러 */
  onNext: () => void;
  /** 고유 키 (스텝 전환 시 리렌더링용) */
  stepKey: string;
}

/**
 * 온보딩 스텝 컨텐츠 컴포넌트
 * 텍스트를 순차적으로 페이드인하고, 모든 텍스트 표시 후 버튼을 보여줌
 */
export function StepContent({
  texts,
  buttonText,
  onNext,
  stepKey,
}: StepContentProps) {
  const [visibleTextCount, setVisibleTextCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const buttonOpacity = useSharedValue(0);

  // 스텝 변경 시 상태 초기화 및 텍스트 순차 표시
  useEffect(() => {
    setVisibleTextCount(0);
    setShowButton(false);
    buttonOpacity.value = 0;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // 각 텍스트 순차 표시
    texts.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleTextCount(index + 1);
      }, index * ANIMATION.TEXT_DELAY);
      timeouts.push(timeout);
    });

    // 모든 텍스트 표시 후 버튼 표시
    const buttonTimeout = setTimeout(() => {
      setShowButton(true);
      buttonOpacity.value = withTiming(1, { duration: ANIMATION.TEXT_FADE_IN });
    }, texts.length * ANIMATION.BUTTON_DELAY_MULTIPLIER);
    timeouts.push(buttonTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [stepKey, texts, buttonOpacity]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View className="flex-1 justify-between px-8">
      {/* 텍스트 영역 */}
      <View className="flex-1">
        {texts.slice(0, visibleTextCount).map((text, index) => (
          <Animated.View
            key={`${stepKey}-text-${index}`}
            entering={FadeIn.duration(ANIMATION.TEXT_FADE_IN)}
          >
            <Text
              className="mb-2 text-white"
              size="body-large"
            >
              {text}
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* 버튼 영역 */}
      <Animated.View style={buttonAnimatedStyle}>
        {showButton && (
          <Button
            size="default"
            onPress={onNext}
            className="bg-btn-act-page"
          >
            <Text
              className="text-white"
              weight="bold"
              size="body-small"
            >
              {buttonText}
            </Text>
          </Button>
        )}
      </Animated.View>
    </View>
  );
}
