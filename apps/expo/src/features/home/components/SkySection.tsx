import { Entypo } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
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

const messageIds = [
  { id: 'acc_01', type: 'acceptance' },
  { id: 'acc_02', type: 'acceptance' },
  { id: 'acc_03', type: 'acceptance' },
  { id: 'val_01', type: 'values' },
  { id: 'val_02', type: 'values' },
  { id: 'act_01', type: 'action' },
  { id: 'act_02', type: 'action' },
  { id: 'act_03', type: 'action' },
  { id: 'rest_01', type: 'rest' },
  { id: 'rest_02', type: 'rest' },
];

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

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messageIds.length);
    const selected = messageIds[randomIndex];
    return {
      id: selected.id,
      type: selected.type,
      text: t(`home.messages.${selected.type}.${selected.id}.text`),
      subText: t(`home.messages.${selected.type}.${selected.id}.subText`),
    };
  };

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
      <View className="flex w-full flex-col gap-8 pt-4">
        <View className="px-12 py-20">
          <AnimatedText className="text-center text-body-large font-medium">
            &quot;{getRandomMessage().text}&quot;
          </AnimatedText>
        </View>
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
              className="pb-0.2 self-start border-b border-slate-600 text-title-small font-medium text-slate-700"
            >
              {t('home.menu.viewActHistory')}
            </AnimatedText>
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
              className="pb-0.2 self-start border-b border-slate-600 text-title-small font-medium text-slate-700"
            >
              {t('home.menu.learning')}
            </AnimatedText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="flex flex-col"
          onPress={() => {
            triggerHaptic('NAVIGATE');
            router.push(ROUTES.ONBOARD);
          }}
        >
          <AnimatedText className="text-title-small font-medium">
            {t('home.menu.logout')}
          </AnimatedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
