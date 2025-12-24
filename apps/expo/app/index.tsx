import { View } from '@src/components/ui';
import { ChatScreen } from '@src/features/chat';
import { CbtButtonList, HomeBackground } from '@src/features/home';

export default function HomeScreen(): React.ReactNode {
  return (
    <View className="flex-1 relative">
      <HomeBackground />
      <CbtButtonList />
      <ChatScreen />
    </View>
  );
}
