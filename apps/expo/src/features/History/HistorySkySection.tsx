import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { AnimatedText, Pressable, View } from '@src/components/ui';

export default function HistorySkySection({
  setPage,
}: {
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT') => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex flex-col items-start justify-center gap-4 bg-page px-8 pt-12"
      style={{ paddingTop: insets.top }}
    >
      <Pressable onPress={() => setPage('HOME')}>
        <Feather
          name="arrow-left"
          size={30}
          color="black"
        />
      </Pressable>
      <View
        className="flex flex-col gap-4"
        style={{ paddingTop: scale(50) }}
      >
        <AnimatedText
          delay={1000}
          className="text-4xl font-medium"
        >
          ACT 기록보기
        </AnimatedText>
        <AnimatedText
          delay={1500}
          className="text-2xl font-medium"
        >
          지금까지 나의 ACT 기록들을 확인할 수 있어요.
        </AnimatedText>
        <AnimatedText
          delay={2000}
          className="text-2xl font-medium"
        >
          깊이가 깊을수록 오래된 기록들이에요.
        </AnimatedText>
      </View>
    </View>
  );
}
