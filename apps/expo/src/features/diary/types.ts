export interface DiaryEntry {
  id: string;
  date: string;
  situation: string;
  thoughts: string;
  feelings: string;
}

export type DiaryStepId = 'situation' | 'thought' | 'emotion';

export type DiaryFunnelContext = {
  situation: string;
  thought: string;
  emotions: string[];
};

export interface EmotionItem {
  emoji: string;
  label: string;
}

export interface EmotionCategory {
  label: string;
  emotions: EmotionItem[];
}
