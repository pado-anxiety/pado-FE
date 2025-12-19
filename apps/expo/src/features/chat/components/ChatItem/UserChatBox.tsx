import { Text, View } from '@src/components/ui';

import type { UserChatUI } from '../../types';

interface UserChatBoxProps {
  chat: UserChatUI;
}

export default function UserChatBox({ chat }: UserChatBoxProps) {
  return (
    <View className="ml-10 bg-chat-user rounded-xl p-4 max-w-[90%]">
      <Text className="text-body-medium text-white">{chat.message}</Text>
    </View>
  );
}
