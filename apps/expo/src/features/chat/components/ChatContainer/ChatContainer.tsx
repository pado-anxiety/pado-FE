import Animated from 'react-native-reanimated';

import { useChatKeyboard } from '../../hooks';
import { UseChatReturn } from '../../hooks/useChat';
import ChatCBTContainer from './CBTRecommendationOverlay';
import ChatInputBar from './ChatInputBar';

export default function CBTRecommendationOverlay({
  list,
  input,
  handlers,
}: UseChatReturn) {
  const { inputAnimatedStyle } = useChatKeyboard();

  return (
    <Animated.View
      className="flex flex-1 flex-col justify-end px-4"
      style={[inputAnimatedStyle]}
      pointerEvents="box-none"
    >
      <ChatCBTContainer
        list={list}
        input={input}
      />
      <ChatInputBar
        input={input}
        handlers={handlers}
      />
    </Animated.View>
  );
}
