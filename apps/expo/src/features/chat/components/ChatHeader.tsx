import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { NavButton, Pressable, Text, View } from '@src/components/ui';
import { PageType } from '@src/features/home/types';
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
        <Pressable hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
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
              {remainingQuota?.quota}/5
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
