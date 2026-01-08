import HistoryCard from '@src/features/History/HistoryCard';

import { HomeListItem as HomeListItemType } from '../types';
import { DeepSeaSection } from './DeepSeaSection';

interface HomeListItemProps {
  item: HomeListItemType;
  totalLength: number;
  hasNext: boolean;
}

export const HomeListItem = ({
  item,
  totalLength,
  hasNext,
}: HomeListItemProps) => {
  if (item.type === 'HOME') {
    return <DeepSeaSection key="home-sea" />;
  } else if (item.type === 'HISTORY') {
    return (
      <HistoryCard
        item={item}
        totalLength={totalLength}
        hasNext={hasNext}
      />
    );
  }
  return null;
};
