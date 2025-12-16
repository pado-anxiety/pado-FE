import { useMemo } from 'react';

import { View } from '@src/components/ui';
import { FlatList } from 'react-native-gesture-handler';

import { ROLE } from '../constants';
import type { Chat, ParsedChat } from '../types';
import { parseChats } from '../utils';
import { AssistantChatBox, UserChatBox } from './ChatItem';

interface ChatListProps {
  chats: Chat[];
  ref: React.RefObject<FlatList | null>;
}

export default function ChatList({ ref, chats }: ChatListProps) {
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
      keyExtractor={(item, index) => `${item.time}-${index}`}
      renderItem={renderChatItem}
    />
  );
}
