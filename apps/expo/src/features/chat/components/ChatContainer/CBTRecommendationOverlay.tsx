import { useState } from 'react';

import { View } from '@src/components/ui';

import { ChatInputState, ChatListState } from '../../hooks/useChat';
import CBTModal from './CBTModal';
import ChatList from './ChatList';

interface ChatCBTContainerProps {
  list: ChatListState;
  input: ChatInputState;
}

export default function ChatCBTContainer({
  list,
  input,
}: ChatCBTContainerProps) {
  const { cbtRecommendation } = input;

  const isCBTRecommendation = !!cbtRecommendation;

  const [recommandationModalHeight, setRecommandationModalHeight] = useState(0);

  return (
    <View
      className="relative flex-1"
      pointerEvents="box-none"
    >
      <ChatList
        list={list}
        input={input}
        recommandationModalHeight={recommandationModalHeight}
      />
      {isCBTRecommendation && (
        <CBTModal
          input={input}
          setRecommandationModalHeight={setRecommandationModalHeight}
        />
      )}
    </View>
  );
}
