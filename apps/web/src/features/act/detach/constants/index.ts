import { DetachStep } from '../types';

export const DETACH_STEPS: DetachStep[] = [
  {
    id: 0,
    i18nKey: 'act.detach.step.step1',
  },
  {
    id: 1,
    i18nKey: 'act.detach.step.step2',
  },
];

export const STEP_COUNT = DETACH_STEPS.length;
