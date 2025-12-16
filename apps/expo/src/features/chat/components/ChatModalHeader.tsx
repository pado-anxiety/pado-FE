import { Entypo } from '@expo/vector-icons';
import { View } from '@src/components/ui';
import { Pressable } from 'react-native-gesture-handler';

interface ChatModalHeaderProps {
  onBack: () => void;
}

export default function ChatModalHeader({ onBack }: ChatModalHeaderProps) {
  return (
    <View className="flex flex-row justify-start gap-2 px-4 pb-3 w-full">
      <Pressable
        onPress={onBack}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Entypo
          name="chevron-thin-left"
          size={24}
          color="rgb(224, 224, 224)"
        />
      </Pressable>
    </View>
  );
}
