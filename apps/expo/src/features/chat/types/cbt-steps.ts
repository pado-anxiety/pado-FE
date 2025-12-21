export type SymptomType = 'BODY' | 'MIND' | null;

export type TriggerType =
  | 'PRESENTATION_EXAM'
  | 'RELATIONSHIP'
  | 'HEALTH_DEATH'
  | 'FUTURE_MONEY'
  | 'UNKNOWN'
  | null;

export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export interface CBTSelections {
  symptom: SymptomType;
  intensity: IntensityLevel;
  trigger: TriggerType;
}

export const SYMPTOM_OPTIONS: { value: SymptomType; label: string }[] = [
  { value: 'BODY', label: '응, 몸부터 진정시켜줘' },
  { value: 'MIND', label: '아니, 머릿속 생각들이 더 문제야' },
];

export const INTENSITY_LEVELS: IntensityLevel[] = [1, 2, 3, 4, 5];

export const TRIGGER_OPTIONS: { value: TriggerType; label: string }[] = [
  { value: 'PRESENTATION_EXAM', label: '발표/시험' },
  { value: 'RELATIONSHIP', label: '인간관계' },
  { value: 'HEALTH_DEATH', label: '건강/죽음' },
  { value: 'FUTURE_MONEY', label: '미래/돈' },
  { value: 'UNKNOWN', label: '이유 없이 불안' },
];

export const INTENSITY_LABELS: Record<
  'BODY' | 'MIND',
  Record<IntensityLevel, string>
> = {
  BODY: {
    1: '약간 거슬리는 정도',
    2: '몸이 좀 뻐근해',
    3: '꽤 힘들어',
    4: '너무 괴로워',
    5: '숨 막혀 (SOS)',
  },
  MIND: {
    1: '신경 쓰이는 정도',
    2: '마음이 복잡해',
    3: '꽤 힘들어',
    4: '너무 괴로워',
    5: '터질 것 같아 (SOS)',
  },
};

export const initialSelections: CBTSelections = {
  symptom: null,
  intensity: 3,
  trigger: null,
};
