import { View } from '@src/components/ui';
import HistorySkySection from '@src/features/history/HistorySkySection';
import LearningSkySection from '@src/features/learning/LearningSkySection';

import { PageType } from '../types';
import { SkySection } from './SkySection';
import { WaveHorizon } from './Wave';

interface HomeListHeaderProps {
  page: PageType;
  setPage: (page: PageType) => void;
  gradientHeight?: number;
}

const SKY_SECTIONS: Record<
  PageType,
  React.FC<{ setPage: (page: PageType) => void }>
> = {
  HOME: SkySection,
  HISTORY: HistorySkySection,
  LEARNING: LearningSkySection,
  CHAT: () => null,
};

export const HomeListHeader = ({
  page,
  setPage,
  gradientHeight,
}: HomeListHeaderProps) => {
  const SkyContent = SKY_SECTIONS[page];

  return (
    <View>
      <SkyContent setPage={setPage} />
      <WaveHorizon
        gradientHeight={gradientHeight}
        page={page}
      />
    </View>
  );
};
