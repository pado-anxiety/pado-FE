import { View } from '@src/components/ui';
import { DeepSeaSection, SkySection, WaveHorizon } from '@src/features/home/';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';
import { Redirect } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen(): React.ReactNode {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <SkySection />
        <WaveHorizon />
        <DeepSeaSection />
      </ScrollView>
    </View>
  );
}
