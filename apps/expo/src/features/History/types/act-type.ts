export type ACTType =
  | 'CONTACT_WITH_PRESENT'
  | 'EMOTION_NOTE'
  | 'COGNITIVE_DEFUSION'
  | 'ACCEPTANCE'
  | 'VALUES'
  | 'COMMITTED_ACTION';

// API response data types
export type ContactWithPresentData = Record<string, never>;

export type EmotionNoteData = {
  feelings: string;
  thoughts: string;
  situation: string;
};

export type CognitiveDefusionData = {
  userTextToken: { text: string; isSelected: boolean }[];
};

export type AcceptanceData = {
  breathingTime: number;
};

export type ValuesData = {
  value: string;
  reason: string;
  action: string;
};

export type CommittedActionData = {
  matter: string;
  value: string;
  barrier: string;
  action: string;
};

// API response wrapper types
export type ContactWithPresent = {
  type: 'CONTACT_WITH_PRESENT';
  data: ContactWithPresentData;
};

export type EmotionNote = {
  type: 'EMOTION_NOTE';
  data: EmotionNoteData;
};

export type CognitiveDefusion = {
  type: 'COGNITIVE_DEFUSION';
  data: CognitiveDefusionData;
};

export type Acceptance = {
  type: 'ACCEPTANCE';
  data: AcceptanceData;
};

export type Values = {
  type: 'VALUES';
  data: ValuesData;
};

export type CommittedAction = {
  type: 'COMMITTED_ACTION';
  data: CommittedActionData;
};

export type ActHistory =
  | ContactWithPresent
  | EmotionNote
  | CognitiveDefusion
  | Acceptance
  | Values
  | CommittedAction;
