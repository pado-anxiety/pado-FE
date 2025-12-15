import { Button } from '@src/components/ui';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SharedValue } from 'react-native-reanimated';

interface ChatInputBarProps {
  message: string;
  onMessageChange: (text: string) => void;
  onFocus: () => void;
  onSend: () => void;
  paddingBottom: SharedValue<number>;
  ref: React.Ref<TextInput>;
  isChatModalVisible: boolean;
  setIsChatModalVisible: (visible: boolean) => void;
}

export default function ChatInputBar({
  message,
  onMessageChange,
  onFocus,
  onSend,
  ref,
  isChatModalVisible,
  setIsChatModalVisible,
}: ChatInputBarProps) {
  return (
    <Pressable
      className="flex flex-row items-end justify-center gap-2 pt-4"
      onPress={async () => {
        if (isChatModalVisible) return;

        setIsChatModalVisible(!isChatModalVisible);
        await new Promise((resolve) => setTimeout(resolve, 500));

        (ref as React.RefObject<TextInput>)?.current?.focus();
      }}
    >
      <TextInput
        ref={ref}
        className="mt-0 bg-white rounded-xl border border-solid border-primary p-4 font-inter text-lg font-medium leading-5 text-body grow"
        placeholder="Enter your chat"
        onFocus={onFocus}
        value={message}
        onChangeText={onMessageChange}
        pointerEvents={isChatModalVisible ? 'auto' : 'none'}
      />
      <Button
        text="⬆"
        onPress={onSend}
        isLoading={false}
        color="primary"
        size="default"
        fullWidth={false}
        disabled={false}
        className="rounded-xl border border-primary py-3"
      />
    </Pressable>
  );
}
