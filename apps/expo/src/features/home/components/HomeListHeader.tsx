import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import { AnimatedText, Pressable, View } from '@src/components/ui';
import HistorySkySection from '@src/features/History/HistorySkySection';

import { PageType } from '../types';
import { SkySection } from './SkySection';
import { WaveHorizon } from './Wave';

interface HomeListHeaderProps {
  page: PageType;
  setPage: (page: PageType) => void;
}

export const HomeListHeader = ({ page, setPage }: HomeListHeaderProps) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

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
            학습
          </AnimatedText>
          <AnimatedText
            delay={1500}
            className="text-2xl font-medium"
          >
            불안에 대해 학습해봐요
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
