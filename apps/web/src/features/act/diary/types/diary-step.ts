export type DiaryStep = {
  id: number;
  i18nKey: string;
};

export type HistoryCard = {
  question: string;
  answer: string;
  feels?: string[];
};
