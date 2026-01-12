import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

import { NavButton, Text, View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';

import { useChatModal } from '../context';
import { useChatQuota } from '../hooks';

interface ChatModalHeaderProps {
  onBack: () => void;
}

export default function ChatModalHeader({ onBack }: ChatModalHeaderProps) {
  const { isChatModalVisible } = useChatModal();

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
          color="rgb(224, 224, 224)"
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
            color="rgb(224, 224, 224)"
          />
          <Text className="text-body-medium text-white">
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
