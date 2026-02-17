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

interface ChatSkySectionProps {
  setPage: (page: PageType) => void;
}

export default function ChatSkySection({ setPage }: ChatSkySectionProps) {
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const { remainingQuota } = useChatQuota();
  const inset = useSafeAreaInsets();

  return (
    <View>
      <View
        className="absolute left-0 right-0 z-10 flex-row items-center justify-between px-6"
        style={{ top: inset.top + scale(8) }}
      >
        <NavButton
          variant="chevron"
          size="small"
          onPress={() => {
            triggerHaptic('NAVIGATE');
            setPage('HOME');
          }}
        />
        <Pressable hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <View className="flex flex-row items-center justify-center gap-4 rounded-full bg-chat-user px-3 py-1.5">
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
