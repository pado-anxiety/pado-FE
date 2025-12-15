import { Button, View } from '@src/components/ui';
import { TextInput } from 'react-native-gesture-handler';

interface ChatInputBarProps {
  message: string;
  onMessageChange: (text: string) => void;
  onFocus: () => void;
  onSend: () => void;
  paddingBottom: number;
  ref: React.Ref<TextInput>;
}

export default function ChatInputBar({
  message,
  onMessageChange,
  onFocus,
  onSend,
  paddingBottom,
  ref,
}: ChatInputBarProps) {
  return (
    <View
      className="flex flex-row items-end justify-center gap-2 px-4"
      style={{ paddingBottom }}
    >
      <TextInput
        ref={ref}
        className="mt-0 bg-white rounded-xl border border-solid border-primary p-4 font-inter text-lg font-medium leading-5 text-body grow"
        placeholder="Enter your chat"
        onFocus={onFocus}
        value={message}
        onChangeText={onMessageChange}
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
    </View>
  );
}
