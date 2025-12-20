import { useMemo } from 'react';

import { ActivityIndicator, View } from '@src/components/ui';
import { FlatList } from 'react-native-gesture-handler';

import { ROLE } from '../../constants';
import { useChatModal } from '../../context';
import { ChatInputState, ChatListState } from '../../hooks/useChat';
import type { AssistantChatUI, CBTRecommendation, ChatUI } from '../../types';
import { CHAT_TYPE } from '../../types/chat-type';
import { parseChats } from '../../utils';
import {
  AssistantChatBox,
  CBTRecommendationBox,
  UserChatBox,
} from '../ChatItem';

interface ChatListProps {
  list: ChatListState;
  input: ChatInputState;
  recommandationModalHeight: number;
}

export default function ChatList({
  list,
  input,
  recommandationModalHeight,
}: ChatListProps) {
  const { chats, isChatLoading, flatListRef } = list;
  const { cbtRecommendation } = input;

  const isCBTRecommendation = !!cbtRecommendation;

  const { isChatModalVisible } = useChatModal();

  const parsedChats = useMemo(() => parseChats(chats), [chats]);

  const renderChatItem = ({ item: chat }: { item: ChatUI }) => {
    if (chat.type === CHAT_TYPE.CBT_RECOMMENDATION) {
      return <CBTRecommendationBox chat={chat as CBTRecommendation} />;
    }

    if (chat.sender === ROLE.USER) {
      return (
        <View className="flex flex-row items-center self-end">
          <UserChatBox chat={chat} />
        </View>
      );
    }

    return (
      <View className="flex flex-row items-center self-start">
        <AssistantChatBox chat={chat as AssistantChatUI} />
      </View>
    );
  };

  if (!isChatModalVisible) return null;

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={parsedChats}
        inverted={true}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          gap: 16,
          paddingTop: isCBTRecommendation ? recommandationModalHeight : 0,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        keyExtractor={(item, index) => item.time + index}
        renderItem={renderChatItem}
        ListHeaderComponent={() => {
          if (isChatLoading) {
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
          }
        }}
        // itemLayoutAnimation={LinearTransition.duration(50)}
      />
    </>
  );
}
