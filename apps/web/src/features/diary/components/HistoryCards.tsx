import { Text } from '@pado/ui';

import { HistoryCard } from '../types';

type HistoryCardsProps = {
  cards: HistoryCard[];
};

export function HistoryCards({ cards }: HistoryCardsProps) {
  return (
    <div className="flex flex-col gap-2">
      {cards.map((card) => (
        <div
          key={card.question + card.answer}
          className="flex flex-col bg-primary p-4 rounded-lg"
        >
          <Text className="text-body-small">{card.question}</Text>
          <Text className="text-body-small line-clamp-2">{card.answer}</Text>
        </div>
      ))}
    </div>
  );
}
