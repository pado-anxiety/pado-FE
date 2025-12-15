import { Text, View } from '@src/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatListProps {
  chats: Chat[];
}

export interface Chat {
  sender: 'USER' | 'AI';
  message: string;
  time: string;
}

// ChatModalHeader 높이 (버튼 + 패딩)
const HEADER_CONTENT_HEIGHT = 60;

export default function ChatList({ chats }: ChatListProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + HEADER_CONTENT_HEIGHT;

  return (
    <View
      className="flex flex-1 w-full flex-col justify-end gap-6 px-4 py-4 overflow-hidden"
      style={{ paddingTop: headerHeight }}
    >
      {chats.map((chat, idx) => (
        <View
          key={idx}
          className="flex flex-row items-center"
          style={{
            alignSelf: chat.sender === 'USER' ? 'flex-end' : 'flex-start',
          }}
        >
          {chat.sender === 'USER' ? (
            <View className="ml-10 bg-blue-100 rounded-xl p-4">
              <Text className="text-body text-lg font-medium">
                {chat.message}
              </Text>
            </View>
          ) : (
            <View className="flex flex-row items-center gap-3">
              <View className="w-12 h-12 bg-red-100 rounded-full" />
              <View className="mr-10 bg-red-100 rounded-xl p-4">
                <Text className="text-body text-lg font-medium">
                  {chat.message}
                </Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
