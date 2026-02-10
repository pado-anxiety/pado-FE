import type { FunnelStep } from '@src/hooks/useFunnel';

import type { ActionContext, ActionStepId, ActionStepMeta } from './types';

export const ACTION_STEPS: readonly FunnelStep<
  ActionContext,
  ActionStepId
>[] = [
  {
    id: 'intro' satisfies ActionStepId,
    meta: { type: 'intro' } satisfies ActionStepMeta,
  },
  {
    id: 'step1' satisfies ActionStepId,
    meta: { i18nKey: 'act.values.step.step1' } satisfies ActionStepMeta,
  },
  {
    id: 'step2' satisfies ActionStepId,
    meta: { i18nKey: 'act.values.step.step2' } satisfies ActionStepMeta,
  },
  {
    id: 'step3' satisfies ActionStepId,
    meta: { i18nKey: 'act.values.step.step3' } satisfies ActionStepMeta,
  },
  {
    id: 'step4' satisfies ActionStepId,
    meta: { i18nKey: 'act.values.step.step4' } satisfies ActionStepMeta,
  },
  {
    id: 'result' satisfies ActionStepId,
    meta: { type: 'result' } satisfies ActionStepMeta,
  },
] as const;

export const STEP_COUNT = 4;
export const MAX_CHAR_LIMIT = 500;
