export type DiaryStepId = 'intro' | 'step1' | 'step2' | 'step3' | 'result';

export interface HistoryCard {
  question: string;
  answer: string;
}

export type DiaryContext = {
  answers: HistoryCard[];
};

export interface DiaryStepMeta {
  type?: 'intro' | 'result';
  i18nKey?: string;
}
