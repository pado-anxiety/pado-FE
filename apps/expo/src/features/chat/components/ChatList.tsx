import { useMemo } from 'react';

import { ActivityIndicator, View } from '@src/components/ui';
import { FlatList } from 'react-native-gesture-handler';

import { ROLE } from '../constants';
import type { Chat, ParsedChat } from '../types';
import { parseChats } from '../utils';
import { AssistantChatBox, UserChatBox } from './ChatItem';

interface ChatListProps {
  chats: Chat[];
  isChatLoading: boolean;
  ref: React.RefObject<FlatList | null>;
}

export default function ChatList({ chats, isChatLoading, ref }: ChatListProps) {
  const parsedChats = useMemo(() => parseChats(chats), [chats]);

  const renderChatItem = ({ item: chat }: { item: ParsedChat }) => (
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
