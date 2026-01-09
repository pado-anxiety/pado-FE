export type ACTType =
  | 'CONTACT_WITH_PRESENT'
  | 'EMOTION_NOTE'
  | 'COGNITIVE_DEFUSION'
  | 'ACCEPTANCE'
  | 'VALUES'
  | 'EMOTION_NOTE';

export type ContactWithPresent = {
  type: 'CONTACT_WITH_PRESENT';
};

export type EmotionNote = {
  type: 'EMOTION_NOTE';
  feelings: string;
  thoughts: string;
  situation: string;
};

export type CognitiveDefusion = {
  type: 'COGNITIVE_DEFUSION';
  userTextToken: { text: string; isSelected: boolean }[];
};

export type Acceptance = {
  type: 'ACCEPTANCE';
  breathingTime: number;
};

export type Values = {
  type: 'VALUES';
  value: string;
};

export type ActHistory =
  | ContactWithPresent
  | EmotionNote
  | CognitiveDefusion
  | Acceptance
  | Values;
