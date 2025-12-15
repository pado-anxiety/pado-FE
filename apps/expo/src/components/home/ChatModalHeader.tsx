import { Button, View } from '@src/components/ui';

interface ChatModalHeaderProps {
  onBack: () => void;
}

export default function ChatModalHeader({ onBack }: ChatModalHeaderProps) {
  return (
    <View className="flex flex-row justify-start gap-2 px-4 w-full">
      <Button
        text="Back"
        onPress={onBack}
        isLoading={false}
        color="primary"
        size="sm"
        fullWidth={false}
        disabled={false}
        className="rounded-xl border border-primary py-3"
      />
    </View>
  );
}
