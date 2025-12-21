import { Pressable } from '@src/components/ui';

import { ChatModalHeader, ChatOverlay } from './components';
import ChatContainer from './components/ChatContainer/ChatContainer';
import { ChatModalProvider } from './context';
import { useChat } from './hooks';

export default function ChatScreen() {
  return (
    <ChatModalProvider>
      <ChatContent />
    </ChatModalProvider>
  );
}

function ChatContent() {
  const { input, list, handlers } = useChat();

  return (
    <>
      <ChatOverlay />

      <Pressable
        className="flex flex-1 flex-col justify-end w-full"
        onPress={() => input.inputRef.current?.blur()}
      >
        <ChatModalHeader onBack={handlers.handleBack} />

        <ChatContainer
          list={list}
          input={input}
          handlers={handlers}
        />
      </Pressable>
    </>
  );
}
