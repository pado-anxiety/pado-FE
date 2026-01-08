import HistoryCard from '@src/features/History/HistoryCard';
import { ACTType } from '@src/features/History/types';

import { HomeListItem as HomeListItemType } from '../types';
import { DeepSeaSection } from './DeepSeaSection';

interface HomeListItemProps {
  item: HomeListItemType;
  handleModalOpen: (id: number, type: ACTType) => void;
}

export const HomeListItem = ({ item, handleModalOpen }: HomeListItemProps) => {
  if (item.type === 'HOME') {
    return <DeepSeaSection key="home-sea" />;
  } else if (item.type === 'HISTORY') {
    console.log(item);

    return (
      <HistoryCard
        item={item}
        handleModalOpen={handleModalOpen}
      />
    );
  }
  return null;
};
