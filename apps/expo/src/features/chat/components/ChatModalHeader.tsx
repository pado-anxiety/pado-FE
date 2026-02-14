import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { Platform } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';
import { NavButton, Text, View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';

import { useChatModal } from '../context';
import { useChatQuota } from '../hooks';

interface ChatModalHeaderProps {
  onBack: () => void;
}

export default function ChatModalHeader({ onBack }: ChatModalHeaderProps) {
  const { isChatModalVisible } = useChatModal();
  const { colorScheme } = useColorScheme();
  const tokens = colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  const { remainingQuota } = useChatQuota();

  if (!isChatModalVisible) return null;

  return (
    <View
      className="flex w-full flex-row justify-between gap-2 px-8 pb-3"
      style={{ marginTop: Platform.OS === 'android' ? scale(10) : 0 }}
    >
      <View className="pt-1.5">
        <NavButton
          variant="chevron"
          size="large"
          color={tokens['--chat-border']}
          onPress={onBack}
        />
      </View>
      <Pressable
        onPress={() => console.log('남은 횟수')}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <View className="flex flex-row items-center justify-center gap-4 rounded-full bg-chat-user px-3 py-1.5">
          <FontAwesome
            name="send"
            size={ICONS_SIZE.small}
            color={tokens['--chat-border']}
          />
          <Text preset="body" className="text-chat-assistant">
            {remainingQuota?.quota}/5
          </Text>
        </View>
      </Pressable>
      {/* <Text className="text-body-medium text-white">
        {parseISO8601(remainingQuota?.timeToRefill || '').h}
      </Text> */}
    </View>
  );
}
