import { Text } from '@pado/ui';

import { HistoryCard } from '../types';

type HistoryCardsProps = {
  cards: HistoryCard[];
};

export function HistoryCards({ cards }: HistoryCardsProps) {
  return (
    <div className="flex flex-col gap-2 w-full flex-wrap overflow-hidden">
      {cards.map((card) => (
        <div
          key={card.question + card.answer}
          className="flex flex-col gap-1 border-l-2 border-gray-400 pl-4 w-full min-w-0"
        >
          <Text className="text-label-small font-bold text-gray-500">
            이전 단계: {card.question}
          </Text>
          <div className="w-full min-w-0 flex-shrink">
            <Text
              as="div"
              className="text-body-small text-gray-500 truncate"
            >
              {card.answer}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
