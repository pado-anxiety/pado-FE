import { useEffect, useState } from 'react';

import { Pressable } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text, View } from '@src/components/ui';

import { ANIMATION } from '../constants';

const EASE_OUT_CUBIC = Easing.bezier(0.215, 0.61, 0.355, 1);
const EASE_OUT_QUAD = Easing.bezier(0.25, 0.46, 0.45, 0.94);

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
  // stepKey is used as dep instead of texts (which is recreated every render from i18n)
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
      buttonOpacity.value = withTiming(1, {
        duration: ANIMATION.TEXT_FADE_IN,
        easing: EASE_OUT_QUAD,
      });
    }, texts.length * ANIMATION.BUTTON_DELAY_MULTIPLIER);
    timeouts.push(buttonTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey, buttonOpacity]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View className="flex-1 justify-between px-8">
      {/* 텍스트 영역 - 중앙 배치 */}
      <View className="flex-1 items-center justify-start pt-20">
        {texts.slice(0, visibleTextCount).map((text, index) => (
          <Animated.View
            key={`${stepKey}-text-${index}`}
            className="w-full"
            entering={FadeIn.duration(ANIMATION.TEXT_FADE_IN).easing(
              EASE_OUT_CUBIC,
            )}
          >
            {text.split('\n').map((line, lineIndex) => (
              <Text
                key={lineIndex}
                bold
                className="text-center text-white"
                style={{ fontSize: 24, lineHeight: 32 }}
              >
                {line}
              </Text>
            ))}
          </Animated.View>
        ))}
      </View>

      {/* 버튼 영역 */}
      <Animated.View
        style={buttonAnimatedStyle}
        className="items-center"
      >
        {showButton && (
          <Pressable onPress={onNext}>
            <Text
              preset="caption"
              className="text-white/60"
            >
              {buttonText}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}
