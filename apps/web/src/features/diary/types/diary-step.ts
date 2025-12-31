export type DiaryStep = {
  id: number;
  question: string;
  description: string;
  example: {
    bad: string;
    good: string;
  };
};

export type HistoryCard = {
  question: string;
  answer: string;
  feels?: string[];
};
