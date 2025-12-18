import { useMemo } from 'react';

import { ActivityIndicator, Text, View } from '@src/components/ui';
import { FlatList } from 'react-native-gesture-handler';

import { ROLE } from '../constants';
import type { ChatAPI, ChatUI } from '../types';
import { CHAT_TYPE } from '../types/chat-type';
import { parseChats } from '../utils';
import { AssistantChatBox, UserChatBox } from './ChatItem';

interface ChatListProps {
  chats: ChatAPI;
  isChatLoading: boolean;
  ref: React.RefObject<FlatList | null>;
}

export default function ChatList({ chats, isChatLoading, ref }: ChatListProps) {
  const parsedChats = useMemo(() => parseChats(chats), [chats]);

  const renderChatItem = ({ item: chat }: { item: ChatUI }) => {
    if (chat.type === CHAT_TYPE.CBT_RECOMMENDATION) {
      return (
        <View className="flex flex-row items-center self-end">
          <Text className="text-body-medium text-gray-500">
            CBT Recommendation
          </Text>
        </View>
      );
    }

    return (
      <View
        className={`flex flex-row items-center ${chat.sender === ROLE.USER ? 'self-end' : 'self-start'}`}
      >
        {chat.sender === ROLE.USER ? (
          <UserChatBox chat={chat} />
        ) : (
          <AssistantChatBox chat={chat} />
        )}
      </View>
    );
  };

  return (
    <>
      <FlatList
        ref={ref}
        data={parsedChats}
        inverted={true}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyExtractor={(item) => item.time}
        renderItem={renderChatItem}
        ListHeaderComponent={() => {
          if (!isChatLoading) return null;

          return (
            <View className="flex flex-row items-start gap-3 max-w-[90%]">
              <View className="w-12 h-12 bg-chat-assistant rounded-full" />
              <View className="flex flex-col items-start gap-2">
                <View className="mr-10 bg-chat-assistant rounded-xl p-4">
                  <ActivityIndicator
                    size="small"
                    color="white"
                  />
                </View>
              </View>
            </View>
          );
        }}
        // itemLayoutAnimation={LinearTransition.duration(50)}
      />
    </>
  );
}
