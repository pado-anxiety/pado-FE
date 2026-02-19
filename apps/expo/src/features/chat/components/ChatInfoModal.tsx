import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Text, View } from '@src/components/ui';
import { MODAL_TRANSITION } from '@src/lib/styles';

interface ChatInfoModalProps {
  onClose: () => void;
}

export function ChatInfoModal({ onClose }: ChatInfoModalProps) {
  const { t } = useTranslation();
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
              {t('chat.info.title')}
            </Text>
            <View style={{ marginTop: 14, gap: 18 }}>
              <Text
                preset="body"
                style={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  textAlign: 'left',
                }}
              >
                {t('chat.info.description')}
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
                {t('chat.info.quota')}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}
