import type { FunnelStep } from '@src/hooks/useFunnel';

import type { AnchorContext, AnchorStepId, AnchorStepMeta } from './types';

export const ANCHOR_STEPS: readonly FunnelStep<AnchorContext, AnchorStepId>[] =
  [
    {
      id: 'intro' satisfies AnchorStepId,
      meta: { type: 'intro' } satisfies AnchorStepMeta,
    },
    {
      id: 'step1' satisfies AnchorStepId,
      meta: {
        count: 5,
        i18nKey: 'act.anchor.step.step1',
      } satisfies AnchorStepMeta,
    },
    {
      id: 'step2' satisfies AnchorStepId,
      meta: {
        count: 4,
        i18nKey: 'act.anchor.step.step2',
      } satisfies AnchorStepMeta,
    },
    {
      id: 'step3' satisfies AnchorStepId,
      meta: {
        count: 3,
        i18nKey: 'act.anchor.step.step3',
      } satisfies AnchorStepMeta,
    },
    {
      id: 'step4' satisfies AnchorStepId,
      meta: {
        count: 2,
        i18nKey: 'act.anchor.step.step4',
      } satisfies AnchorStepMeta,
    },
    {
      id: 'step5' satisfies AnchorStepId,
      meta: {
        count: 1,
        i18nKey: 'act.anchor.step.step5',
      } satisfies AnchorStepMeta,
    },
    {
      id: 'result' satisfies AnchorStepId,
      meta: { type: 'result' } satisfies AnchorStepMeta,
    },
  ] as const;
