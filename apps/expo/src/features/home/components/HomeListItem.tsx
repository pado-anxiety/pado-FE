import HistoryCard from '@src/features/history/HistoryCard';
import { ACTType } from '@src/features/history/types';
import { LearningCard } from '@src/features/learning';

import {
  HistoryItemWithIndex,
  HomeListItem as HomeListItemType,
  LearningItem,
} from '../types';
import { DeepSeaSection } from './DeepSeaSection';

interface HomeListItemProps {
  item: HomeListItemType;
  index: number;
  handleModalOpen: (id: string, type: ACTType, date: string) => void;
  onContentHeight?: (height: number) => void;
}

const ITEM_RENDERERS: Record<
  HomeListItemType['type'],
  (props: HomeListItemProps) => React.ReactNode
> = {
  HOME: ({ onContentHeight }) => (
    <DeepSeaSection
      key="home-sea"
      onContentHeight={onContentHeight}
    />
  ),
  HISTORY: ({ item, index, handleModalOpen }) => (
    <HistoryCard
      item={item as HistoryItemWithIndex}
      index={index}
      handleModalOpen={handleModalOpen}
    />
  ),
  LEARNING: ({ item }) => (
    <LearningCard item={item as LearningItem} />
  ),
};

export const HomeListItem = (props: HomeListItemProps) => {
  const renderer = ITEM_RENDERERS[props.item.type];
  return renderer ? renderer(props) : null;
};
