import type { FunnelStep } from '@src/hooks/useFunnel';

import type { DiaryContext, DiaryStepId, DiaryStepMeta } from './types';

export const DIARY_STEPS: readonly FunnelStep<DiaryContext, DiaryStepId>[] = [
  {
    id: 'intro' satisfies DiaryStepId,
    meta: { type: 'intro' } satisfies DiaryStepMeta,
  },
  {
    id: 'step1' satisfies DiaryStepId,
    meta: { i18nKey: 'act.diary.step.step1' } satisfies DiaryStepMeta,
  },
  {
    id: 'step2' satisfies DiaryStepId,
    meta: { i18nKey: 'act.diary.step.step2' } satisfies DiaryStepMeta,
  },
  {
    id: 'step3' satisfies DiaryStepId,
    meta: { i18nKey: 'act.diary.step.step3' } satisfies DiaryStepMeta,
  },
  {
    id: 'result' satisfies DiaryStepId,
    meta: { type: 'result' } satisfies DiaryStepMeta,
  },
] as const;

export const STEP_COUNT = 3;
export const MAX_CHAR_LIMIT = 500;
