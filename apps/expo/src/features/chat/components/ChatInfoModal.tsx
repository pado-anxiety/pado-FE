import { Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Text, View } from '@src/components/ui';
import { MODAL_TRANSITION } from '@src/lib/styles';

interface ChatInfoModalProps {
  onClose: () => void;
}

export function ChatInfoModal({ onClose }: ChatInfoModalProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      className="absolute inset-0"
    >
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center bg-black/80 px-6"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full"
        >
          <Animated.View
            entering={MODAL_TRANSITION.entering}
            style={{
              width: '100%',
              borderRadius: 24,
              padding: 32,
              backgroundColor: 'rgba(28, 32, 48, 0.95)',
            }}
          >
            <Text
              preset="heading"
              bold
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              마음속 깊은 바다
            </Text>
            <View style={{ marginTop: 14, gap: 18 }}>
              <Text
                preset="body"
                style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  textAlign: 'left',
                }}
              >
                생각과 고민을 자유롭게 작성하고{'\n'}
                내면의 깊은 바다와 대화를 시작해보세요.
              </Text>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Text
                preset="sub"
                style={{ color: 'rgba(255, 255, 255, 0.4)', textAlign: 'left' }}
              >
                기본 대화 횟수는 20회이며, 1시간마다 1개씩 충전됩니다.
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
