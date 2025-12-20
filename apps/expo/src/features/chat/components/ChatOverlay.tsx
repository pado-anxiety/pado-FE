import { Pressable } from '@src/components/ui';

import { useChatModal } from '../context';

export default function ChatOverlay() {
  const { isChatModalVisible } = useChatModal();

  if (!isChatModalVisible) return null;

  return (
    <Pressable className="flex flex-1 absolute top-0 left-0 right-0 bottom-0 bg-chat-overlay" />
  );
}
