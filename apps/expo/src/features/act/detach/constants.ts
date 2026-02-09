import type { FunnelStep } from '@src/hooks/useFunnel';

import type { DetachContext, DetachStepId, DetachStepMeta } from './types';

export const DETACH_STEPS: readonly FunnelStep<DetachContext, DetachStepId>[] =
  [
    {
      id: 'intro' satisfies DetachStepId,
      meta: { type: 'intro' } satisfies DetachStepMeta,
    },
    {
      id: 'step1' satisfies DetachStepId,
      meta: { i18nKey: 'act.detach.step.step1' } satisfies DetachStepMeta,
    },
    {
      id: 'step2' satisfies DetachStepId,
      meta: { i18nKey: 'act.detach.step.step2' } satisfies DetachStepMeta,
    },
    {
      id: 'result' satisfies DetachStepId,
      meta: { type: 'result' } satisfies DetachStepMeta,
    },
  ] as const;

export const STEP_COUNT = 2;
export const MAX_CHAR_LIMIT = 100;
