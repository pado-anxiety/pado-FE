import {
  ChatBubbleAssistant,
  ChatBubbleUser,
  ChatLoadingBubble,
} from '@src/features/chat';
import HistoryCard from '@src/features/history/HistoryCard';
import { ACTType } from '@src/features/history/types';
import { LearningCard } from '@src/features/learning';

import { HomeListItem as HomeListItemType } from '../types';
import { DeepSeaSection } from './DeepSeaSection';

interface HomeListItemProps {
  item: HomeListItemType;
  handleModalOpen: (id: string, type: ACTType, date: string) => void;
  onContentHeight?: (height: number) => void;
}

export const HomeListItem = ({
  item,
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
        handleModalOpen={handleModalOpen}
      />
    );
  } else if (item.type === 'CHAT_MESSAGE') {
    if (item.sender === 'USER') {
      return <ChatBubbleUser item={item} />;
    }
    return <ChatBubbleAssistant item={item} />;
  } else if (item.type === 'CHAT_LOADING') {
    return <ChatLoadingBubble />;
  } else if (item.type === 'LEARNING') {
    return <LearningCard item={item} />;
  }
  return null;
};
