export type EmbraceStepId = 'intro' | 'step' | 'result';

export type EmbraceContext = {
  breathingTime: number;
};

export interface EmbraceStepMeta {
  type?: 'intro' | 'step' | 'result';
}
