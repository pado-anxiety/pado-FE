export type AnchorStepId =
  | 'intro'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'result';

export type AnchorContext = Record<string, never>;

export interface AnchorStepMeta {
  type?: 'intro' | 'result';
  count?: number;
  i18nKey?: string;
}
