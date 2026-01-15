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

const mainMessages = [
  // 1. 수용 (Acceptance) - 불안이 높을 때
  {
    id: 'acc_01',
    type: 'ACCEPTANCE',
    text: '파도는 치겠지만, 당신이라는 바다는 여전히 깊고 단단합니다.',
    subText: '불안을 없애려 애쓰지 않아도 괜찮아요.',
  },
  {
    id: 'acc_02',
    type: 'ACCEPTANCE',
    text: '당신은 몰아치는 파도가 아니라, 그 파도를 품고 있는 바다 그 자체입니다.',
    subText: '감정은 잠시 머물다 가는 물결일 뿐이에요.',
  },
  {
    id: 'acc_03',
    type: 'ACCEPTANCE',
    text: '거친 물살은 잠시 지나가는 것일 뿐, 당신의 심해는 고요합니다.',
    subText: '잠시 숨을 고르고 내면의 평온을 느껴보세요.',
  },

  // 2. 가치 (Values) - 방향을 잃었을 때
  {
    id: 'val_01',
    type: 'VALUES',
    text: '안개가 자욱해도 괜찮아요. 당신의 나침반은 여전히 빛나고 있습니다.',
    subText: '오늘 당신이 지키고 싶은 소중한 가치는 무엇인가요?',
  },
  {
    id: 'val_02',
    type: 'VALUES',
    text: '폭풍우 속에서도 방향을 잃지 않는다면, 그것으로 충분한 항해입니다.',
    subText: '결과보다 중요한 건 당신이 향하고 있는 곳입니다.',
  },

  // 3. 전념 행동 (Action) - 실천이 필요할 때
  {
    id: 'act_01',
    type: 'ACTION',
    text: '아주 사소한 노 젓기 한 번이 오늘의 해류를 바꿉니다.',
    subText: '지금 바로 시작할 수 있는 가장 작은 일은 무엇인가요?',
  },
  {
    id: 'act_02',
    type: 'ACTION',
    text: '당신이 오늘 일으킬 작은 파동은 어디를 향하고 있나요?',
    subText: '당신의 의지가 만드는 물결은 힘이 있습니다.',
  },
  {
    id: 'act_03',
    type: 'ACTION',
    text: '거창한 성공보다, 오늘 하루 당신의 궤적을 믿으세요.',
    subText: '작은 움직임들이 모여 당신의 바다를 완성합니다.',
  },

  // 4. 휴식 및 자기자비 (Self-Compassion) - 지쳤을 때
  {
    id: 'rest_01',
    type: 'REST',
    text: '잠시 닻을 내리고 쉬어도 좋습니다. 멈춤도 항해의 일부니까요.',
    subText: '지친 나를 위해 잠시 정지 버튼을 눌러주세요.',
  },
  {
    id: 'rest_02',
    type: 'REST',
    text: '파도를 이기려 하기보다, 파도 위에 몸을 맡기고 흐름을 타보세요.',
    subText: '애쓰지 않아도 당신의 항해는 계속됩니다.',
  },
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
    const randomIndex = Math.floor(Math.random() * mainMessages.length);
    return mainMessages[randomIndex];
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
      </View>
    </View>
  );
}
