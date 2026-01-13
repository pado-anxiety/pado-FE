import { Entypo } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimatedText,
  Pressable,
  TouchableOpacity,
  View,
} from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';
import { ROUTES } from '@src/lib/route';
import { useWaveSoundStore } from '@src/lib/sound';
import { ICONS_SIZE } from '@src/lib/styles';

export function SkySection({
  setPage,
}: {
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT' | 'LEARNING') => void;
}): React.ReactNode {
  const { t } = useTranslation();
  const { pause, play, isPlaying } = useWaveSoundStore();
  // const { logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // const { data: user } = useQuery({
  //   queryKey: [API_KEY.USER],
  //   queryFn: () => userAPI.getUser(),
  // });

  return (
    <View
      className="flex flex-col items-start justify-center gap-4 bg-page px-8"
      style={{
        paddingTop: insets.top,
      }}
    >
      <View className="flex w-full flex-row items-end justify-end gap-4">
        <Pressable onPress={() => (isPlaying ? pause() : play())}>
          <Entypo
            name={isPlaying ? 'sound' : 'sound-mute'}
            size={ICONS_SIZE.large}
            color="black"
          />
        </Pressable>
        <Pressable onPress={() => router.push(ROUTES.SETTINGS.BASE)}>
          <MaterialIcons
            name="settings"
            size={ICONS_SIZE.large}
            color="black"
          />
        </Pressable>
      </View>
      <View className="flex w-full flex-col gap-8 pt-12">
        {/* <View className="flex w-full flex-col gap-2">
          <AnimatedText
            delay={1000}
            className="text-body-large font-medium"
          >
            안녕하세요
          </AnimatedText>
          <AnimatedText
            delay={1000}
            className="text-body-large font-medium"
          >
            {user?.name} 님
          </AnimatedText>
        </View> */}
        <View className="flex w-full flex-col gap-4">
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => {
              triggerHaptic('NAVIGATE');
              setPage('HISTORY');
            }}
          >
            <AnimatedText
              delay={1500}
              className="text-title-large font-medium text-slate-700"
            >
              {t('home.menu.viewActHistory')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(1500)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col"
            onPress={() => {
              triggerHaptic('NAVIGATE');
              setPage('LEARNING');
            }}
          >
            <AnimatedText
              delay={2000}
              className="text-title-large font-medium text-slate-700"
            >
              {t('home.menu.learning')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
          {/* 
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => router.push(ROUTES.ONBOARD)}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              {t('home.menu.onboarding')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => router.push(ROUTES.LOGIN)}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              {t('home.menu.login')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => {
              triggerHaptic('NAVIGATE');
              setIsOnboarded(false);
              logout();
            }}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              초기화 버튼
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}
