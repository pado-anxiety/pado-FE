export type DetachStepId = 'intro' | 'step1' | 'step2' | 'result';

export interface UserTextToken {
  text: string;
  isSelected: boolean;
}

export type DetachContext = {
  userTextTokens: UserTextToken[];
};

export interface DetachStepMeta {
  type?: 'intro' | 'result';
  i18nKey?: string;
}
