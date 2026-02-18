import { useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

import { View } from '@src/components/ui';

interface ChatInputProps {
  input: {
    inputRef: React.RefObject<TextInput | null>;
    messageRef: React.RefObject<string>;
  };
  onSend: () => void;
  onFocus?: () => void;
  onRecommend?: () => void;
  isRecommendLoading?: boolean;
}

const INPUT_HEIGHT = 55;
const INPUT_RADIUS = 16;
const SEND_BUTTON_PADDING = 4;
const SEND_BUTTON_SIZE = INPUT_HEIGHT - SEND_BUTTON_PADDING * 2;
const RECOMMEND_SIZE = 46;
const RECOMMEND_RADIUS = RECOMMEND_SIZE / 2;
const STROKE_WIDTH = 3;
const INACTIVE_BG = 'rgba(255, 255, 255, 0.1)';
const INACTIVE_ICON = 'rgba(255, 255, 255, 0.4)';

export function ChatInput({
  input,
  onSend,
  onFocus,
  onRecommend,
  isRecommendLoading,
}: ChatInputProps) {
  const insets = useSafeAreaInsets();
  const [hasText, setHasText] = useState(false);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isRecommendLoading) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration: 1200, easing: Easing.linear }),
        -1,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [isRecommendLoading, rotation]);

  const rainbowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleChangeText = (text: string) => {
    input.messageRef.current = text;
    setHasText(text.trim().length > 0);
  };

  const handleSend = () => {
    onSend();
    setHasText(false);
  };

  return (
    <View style={{ paddingBottom: insets.bottom + 8 }}>
      <View
        style={{
          marginHorizontal: 16,
          marginVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Pressable onPress={onRecommend}>
          <View
            style={{
              width: RECOMMEND_SIZE,
              height: RECOMMEND_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isRecommendLoading && (
              <Animated.View style={[StyleSheet.absoluteFill, rainbowStyle]}>
                <Svg
                  width={RECOMMEND_SIZE}
                  height={RECOMMEND_SIZE}
                >
                  <Defs>
                    <SvgLinearGradient
                      id="rainbow"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <Stop
                        offset="0"
                        stopColor="#FF6B6B"
                      />
                      <Stop
                        offset="0.25"
                        stopColor="#FECA57"
                      />
                      <Stop
                        offset="0.5"
                        stopColor="#48DBFB"
                      />
                      <Stop
                        offset="0.75"
                        stopColor="#FF9FF3"
                      />
                      <Stop
                        offset="1"
                        stopColor="#54A0FF"
                      />
                    </SvgLinearGradient>
                  </Defs>
                  <Circle
                    cx={RECOMMEND_RADIUS}
                    cy={RECOMMEND_RADIUS}
                    r={RECOMMEND_RADIUS - STROKE_WIDTH / 2}
                    stroke="url(#rainbow)"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                  />
                </Svg>
              </Animated.View>
            )}
            <View
              style={{
                width: RECOMMEND_SIZE,
                height: RECOMMEND_SIZE,
                borderRadius: RECOMMEND_RADIUS,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="sparkles"
                size={18}
                color="rgba(255, 255, 255, 0.8)"
              />
            </View>
          </View>
        </Pressable>
        <View
          style={{
            flex: 1,
            height: INPUT_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: INPUT_RADIUS,
            backgroundColor: 'rgba(15, 20, 30, 0.8)',
            paddingLeft: 16,
            paddingRight: SEND_BUTTON_PADDING,
          }}
        >
          <TextInput
            ref={input.inputRef}
            style={{
              flex: 1,
              fontSize: 16,
              color: '#FFFFFF',
              // paddingVertical: 6,
            }}
            placeholder="메시지를 입력해주세요"
            placeholderTextColor="rgba(255, 255, 255, 0.35)"
            onChangeText={handleChangeText}
            onFocus={onFocus}
          />
          <Pressable
            onPress={handleSend}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View
              style={{
                width: SEND_BUTTON_SIZE,
                height: SEND_BUTTON_SIZE,
                borderRadius: 12,
                backgroundColor: hasText
                  ? 'rgba(108, 108, 108, 1)'
                  : INACTIVE_BG,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color={hasText ? '#0C0D10' : INACTIVE_ICON}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
