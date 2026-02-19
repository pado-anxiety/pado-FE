import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { NavButton, Pressable, Text, View } from '@src/components/ui';
import { PageType } from '@src/features/home/types';
import { showAlert } from '@src/lib/alert';
import { triggerHaptic } from '@src/lib/haptics';
import { ICONS_SIZE } from '@src/lib/styles';

import { useChatQuota } from '../hooks/useChatQuota';

const HEADER_HEIGHT = 48;

interface ChatHeaderProps {
  setPage: (page: PageType) => void;
}

export function ChatHeader({ setPage }: ChatHeaderProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const insets = useSafeAreaInsets();
  const { remainingQuota } = useChatQuota();

  return (
    <View
      style={{
        paddingTop: insets.top + scale(8),
        paddingHorizontal: 24,
      }}
      pointerEvents="box-none"
    >
      <View
        style={{
          height: HEADER_HEIGHT,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NavButton
          variant="chevron"
          size="small"
          color="#FFFFFF"
          onPress={() => {
            triggerHaptic('NAVIGATE');
            setPage('HOME');
          }}
        />
        <Pressable
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={() => {
            showAlert.warning(
              '마음속 깊은 바다',
              '마음속 깊은 바다와 대화를 나눠보세요.\n내면의 깊은 바다가 메아리로 답해줄 거예요.\n\n대화 횟수는 하루 20회이며, 1시간마다 1개씩 충전됩니다.',
            );
          }}
        >
          <View className="flex flex-row items-center justify-center gap-1.5 rounded-full bg-chat-user px-3 py-1.5">
            <FontAwesome
              name="send"
              size={ICONS_SIZE.small}
              color={tokens['--chat-border']}
            />
            <Text
              preset="body"
              className="text-chat-assistant"
            >
              {remainingQuota?.quota}/20
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
