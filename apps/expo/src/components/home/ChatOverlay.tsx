import { Pressable } from '@src/components/ui';

interface ChatOverlayProps {
  visible: boolean;
}

export default function ChatOverlay({ visible }: ChatOverlayProps) {
  if (!visible) return null;

  return (
    <Pressable className="flex flex-1 absolute top-0 left-0 right-0 bottom-0 bg-black opacity-80" />
  );
}
