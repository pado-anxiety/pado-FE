import HistoryCard from '@src/features/History/HistoryCard';
import { ACTType } from '@src/features/History/types';
import { LearningCard } from '@src/features/learning';

import { HomeListItem as HomeListItemType } from '../types';
import { DeepSeaSection } from './DeepSeaSection';

interface HomeListItemProps {
  item: HomeListItemType;
  handleModalOpen: (id: string, type: ACTType, date: string) => void;
}

export const HomeListItem = ({ item, handleModalOpen }: HomeListItemProps) => {
  if (item.type === 'HOME') {
    return <DeepSeaSection key="home-sea" />;
  } else if (item.type === 'HISTORY') {
    return (
      <HistoryCard
        item={item}
        handleModalOpen={handleModalOpen}
      />
    );
  } else if (item.type === 'LEARNING') {
    return <LearningCard item={item} />;
  }
  return null;
};
