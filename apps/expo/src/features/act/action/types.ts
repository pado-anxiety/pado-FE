export type ActionStepId =
  | 'intro'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'result';

export type Value = {
  work: number | null;
  growth: number | null;
  leisure: number | null;
  relationship: number | null;
};

export type ActionContext = {
  selectedValue: Value;
  selectedDomain: keyof Value;
  orientation: string;
  obstacle: string;
  action: string;
};

export interface ActionStepMeta {
  type?: 'intro' | 'result';
  i18nKey?: string;
}
