import { LoadingSpinner, View } from '@src/components/ui';

export function ChatLoadingBubble() {
  return (
    <View className="max-w-[90%] flex-row items-start gap-3 px-4 py-1">
      <View className="h-12 w-12 rounded-full bg-chat-assistant" />
      <View className="flex-col items-start gap-2">
        <View className="mr-10 rounded-2xl bg-chat-assistant p-4">
          <LoadingSpinner />
        </View>
      </View>
    </View>
  );
}
