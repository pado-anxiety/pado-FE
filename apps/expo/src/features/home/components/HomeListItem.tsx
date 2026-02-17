import HistoryCard from '@src/features/history/HistoryCard';
import { ACTType } from '@src/features/history/types';
import { LearningCard } from '@src/features/learning';

import { HomeListItem as HomeListItemType } from '../types';
import { DeepSeaSection } from './DeepSeaSection';

interface HomeListItemProps {
  item: HomeListItemType;
  index: number;
  handleModalOpen: (id: string, type: ACTType, date: string) => void;
  onContentHeight?: (height: number) => void;
}

export const HomeListItem = ({
  item,
  index,
  handleModalOpen,
  onContentHeight,
}: HomeListItemProps) => {
  if (item.type === 'HOME') {
    return (
      <DeepSeaSection
        key="home-sea"
        onContentHeight={onContentHeight}
      />
    );
  } else if (item.type === 'HISTORY') {
    return (
      <HistoryCard
        item={item}
        index={index}
        handleModalOpen={handleModalOpen}
      />
    );
  } else if (item.type === 'LEARNING') {
    return <LearningCard item={item} />;
  }
  return null;
};
