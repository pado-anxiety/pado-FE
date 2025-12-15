import { ChatScreen } from '@src/components/home';
import { View } from '@src/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen(): React.ReactNode {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-red-100"
      style={{ paddingTop: insets.top }}
    >
      <ChatScreen />
    </View>
  );
}
