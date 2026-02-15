import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import {
  AnimatedText,
  NavButton,
  Pressable,
  Text,
  View,
} from '@src/components/ui';
import { useChatQuota } from '@src/features/chat/hooks';
import HistorySkySection from '@src/features/history/HistorySkySection';
import { triggerHaptic } from '@src/lib/haptics';
import { ICONS_SIZE } from '@src/lib/styles';

import { PageType } from '../types';
import { SkySection } from './SkySection';
import { WaveHorizon } from './Wave';

interface HomeListHeaderProps {
  page: PageType;
  setPage: (page: PageType) => void;
  onHeaderLayout?: (height: number) => void;
  gradientHeight?: number;
}

export const HomeListHeader = ({
  page,
  setPage,
  onHeaderLayout,
  gradientHeight,
}: HomeListHeaderProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
  const { remainingQuota } = useChatQuota();

  let SkyContent = null;

  if (page === 'HOME') {
    SkyContent = (
      <SkySection
        key="home-sky"
        setPage={setPage}
      />
    );
  } else if (page === 'HISTORY') {
    SkyContent = (
      <HistorySkySection
        key="history-sky"
        setPage={setPage}
      />
    );
  } else if (page === 'LEARNING') {
    SkyContent = (
      <View
        className="flex flex-col items-start justify-center gap-4 bg-page px-8"
        style={{ paddingTop: insets.top }}
      >
        <View className="relative w-full">
          <View className="absolute left-[-8px]">
            <NavButton
              variant="back"
              size="large"
              onPress={() => {
                triggerHaptic('NAVIGATE');
                setPage('HOME');
              }}
            />
          </View>
        </View>
        <View
          className="flex flex-col gap-2"
          style={{ paddingTop: scale(80) }}
        >
          <AnimatedText
            delay={1000}
            preset="title"
            bold
            className="text-sub"
          >
            {t('home.learning.title')}
          </AnimatedText>
          <AnimatedText
            delay={1500}
            preset="heading"
            className="text-sub"
          >
            {t('home.learning.subtitle')}
          </AnimatedText>
        </View>
      </View>
    );
  } else if (page === 'CHAT') {
    SkyContent = (
      <View
        className="flex flex-row items-center justify-between bg-page px-6"
        style={{ paddingTop: insets.top + 8, paddingBottom: 8 }}
      >
        <NavButton
          variant="chevron"
          size="large"
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
    );
  }

  return (
    <View
      onLayout={
        onHeaderLayout
          ? (e) => onHeaderLayout(e.nativeEvent.layout.height)
          : undefined
      }
    >
      {SkyContent}
      <WaveHorizon gradientHeight={gradientHeight} />
    </View>
  );
};
