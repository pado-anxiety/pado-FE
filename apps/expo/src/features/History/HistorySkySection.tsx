import { Feather } from '@expo/vector-icons';
import { Pressable, View } from '@src/components/ui';
import { ROUTES } from '@src/lib/route';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

export default function HistorySkySection() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex flex-col bg-white items-start justify-center gap-4 px-8 pt-12"
      style={{ paddingTop: insets.top }}
    >
      <Pressable onPress={() => router.push(ROUTES.HOME)}>
        <Feather
          name="arrow-left"
          size={30}
          color="black"
        />
      </Pressable>
      <View
        className="flex flex-col gap-4"
        style={{ paddingTop: scale(20) }}
      >
        <Animated.Text
          entering={FadeIn.duration(1000)}
          className="text-4xl font-medium"
          style={{ fontFamily: 'NanumSquareNeo-Variable' }}
        >
          ACT 기록보기
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.duration(1500)}
          className="text-2xl font-medium"
          style={{ fontFamily: 'NanumSquareNeo-Variable' }}
        >
          지금까지 나의 ACT 기록들을 확인할 수 있어요.
        </Animated.Text>
        <Animated.Text
          className="text-2xl font-medium"
          style={{ fontFamily: 'NanumSquareNeo-Variable' }}
          entering={FadeIn.duration(2000)}
        >
          깊이가 깊을수록 오래된 기록들이에요.
        </Animated.Text>
      </View>
    </View>
  );
}
