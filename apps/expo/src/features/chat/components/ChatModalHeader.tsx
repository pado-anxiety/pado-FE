import { Entypo, FontAwesome } from '@expo/vector-icons';
import { Text, View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';
import { Pressable } from 'react-native-gesture-handler';

import { useChatQuota } from '../hooks';

interface ChatModalHeaderProps {
  onBack: () => void;
}

export default function ChatModalHeader({ onBack }: ChatModalHeaderProps) {
  const { remainingQuota } = useChatQuota();

  return (
    <View className="flex flex-row justify-between gap-2 px-8 pb-3 w-full">
      <Pressable
        onPress={onBack}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <View className="pt-1.5">
          <Entypo
            name="chevron-thin-left"
            size={ICONS_SIZE.medium}
            color="rgb(224, 224, 224)"
          />
        </View>
      </Pressable>
      <Pressable
        onPress={() => console.log('남은 횟수')}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <View className="flex flex-row justify-center items-center gap-4 bg-chat-user rounded-full px-3 py-1.5">
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
