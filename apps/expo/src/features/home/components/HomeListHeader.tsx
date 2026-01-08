import { View } from '@src/components/ui';
import HistorySkySection from '@src/features/History/HistorySkySection';

import { PageType } from '../types';
import { SkySection } from './SkySection';
import { WaveHorizon } from './Wave';

interface HomeListHeaderProps {
  page: PageType;
  setPage: (page: PageType) => void;
}

export const HomeListHeader = ({ page, setPage }: HomeListHeaderProps) => {
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
  }

  return (
    <View>
      {SkyContent}
      <WaveHorizon />
    </View>
  );
};
