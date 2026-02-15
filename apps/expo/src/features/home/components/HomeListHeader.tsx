import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { AnimatedText, NavButton, View } from '@src/components/ui';
import HistorySkySection from '@src/features/history/HistorySkySection';
import { triggerHaptic } from '@src/lib/haptics';

import { PageType } from '../types';
import { SkySection } from './SkySection';
import { WaveHorizon } from './Wave';

interface HomeListHeaderProps {
  page: PageType;
  setPage: (page: PageType) => void;
}

export const HomeListHeader = ({ page, setPage }: HomeListHeaderProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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
  }

  return (
    <View>
      {SkyContent}
      <WaveHorizon />
    </View>
  );
};
