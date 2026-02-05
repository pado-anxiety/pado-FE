import { useCallback, useMemo, useState } from 'react';

/**
 * 퍼널의 각 스텝 정의
 */
export interface FunnelStep<TContext> {
  /** 스텝 고유 ID */
  id: string;
  /** 스텝 진입 시 실행할 비동기 작업 (optional) */
  onEnter?: (context: TContext) => Promise<void> | void;
  /** 다음 스텝으로 이동 전 실행할 비동기 작업 (optional) */
  onNext?: (context: TContext) => Promise<boolean> | boolean;
  /** 스텝 컴포넌트 렌더링에 필요한 추가 데이터 */
  meta?: Record<string, unknown>;
}

/**
 * useFunnel 훅 옵션
 */
export interface UseFunnelOptions<
  TStepId extends string,
  TContext extends Record<string, unknown>,
> {
  /** 퍼널 고유 ID */
  id: string;
  /** 스텝 정의 배열 */
  steps: readonly FunnelStep<TContext>[];
  /** 초기 컨텍스트 */
  initialContext: TContext;
  /** 퍼널 완료 시 콜백 */
  onComplete?: (context: TContext) => void;
}

/**
 * 히스토리 항목
 */
interface HistoryEntry<TContext> {
  stepId: string;
  context: TContext;
}

/**
 * useFunnel 반환 타입
 */
export interface UseFunnelReturn<
  TStepId extends string,
  TContext extends Record<string, unknown>,
> {
  /** 현재 스텝 ID */
  currentStep: TStepId;
  /** 현재 스텝 인덱스 */
  currentIndex: number;
  /** 현재 컨텍스트 */
  context: TContext;
  /** 현재 스텝 정의 */
  step: FunnelStep<TContext>;
  /** 히스토리 관리 객체 */
  history: {
    /** 다음 스텝으로 이동 */
    push: (
      nextStepId?: TStepId,
      newContext?: Partial<TContext> | ((prev: TContext) => TContext)
    ) => Promise<void>;
    /** 현재 스텝의 컨텍스트만 업데이트 */
    replace: (
      newContext: Partial<TContext> | ((prev: TContext) => TContext)
    ) => void;
    /** 이전 스텝으로 이동 */
    back: () => void;
    /** 특정 인덱스로 이동 */
    go: (index: number) => void;
  };
  /** 첫 번째 스텝 여부 */
  isFirst: boolean;
  /** 마지막 스텝 여부 */
  isLast: boolean;
  /** 전체 스텝 수 */
  totalSteps: number;
  /** 히스토리 배열 */
  historySteps: readonly HistoryEntry<TContext>[];
}

/**
 * 선언적 퍼널 관리 훅
 *
 * @example
 * ```tsx
 * const funnel = useFunnel({
 *   id: 'onboard',
 *   steps: [
 *     { id: 'welcome' },
 *     { id: 'breathing', onNext: async () => { await doBreathing(); return true; } },
 *     { id: 'complete' },
 *   ],
 *   initialContext: {},
 *   onComplete: (ctx) => router.replace('/login'),
 * });
 *
 * return (
 *   <funnel.Render
 *     welcome={({ history }) => <Welcome onNext={() => history.push()} />}
 *     breathing={({ history }) => <Breathing onNext={() => history.push()} />}
 *     complete={({ history }) => <Complete onFinish={() => funnel.complete()} />}
 *   />
 * );
 * ```
 */
export function useFunnel<
  TStepId extends string,
  TContext extends Record<string, unknown> = Record<string, unknown>,
>(
  options: UseFunnelOptions<TStepId, TContext>
): UseFunnelReturn<TStepId, TContext> {
  const { steps, initialContext, onComplete } = options;

  // 히스토리 스택
  const [historyStack, setHistoryStack] = useState<HistoryEntry<TContext>[]>([
    { stepId: steps[0].id, context: initialContext },
  ]);

  // 현재 히스토리 인덱스
  const [historyIndex, setHistoryIndex] = useState(0);

  // 현재 상태 계산
  const currentEntry = historyStack[historyIndex];
  const currentStepIndex = steps.findIndex((s) => s.id === currentEntry.stepId);
  const currentStep = steps[currentStepIndex];

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  // 다음 스텝으로 이동
  const push = useCallback(
    async (
      nextStepId?: TStepId,
      newContext?: Partial<TContext> | ((prev: TContext) => TContext)
    ) => {
      const currentCtx = historyStack[historyIndex].context;

      // onNext 콜백 실행
      if (currentStep.onNext) {
        const shouldProceed = await currentStep.onNext(currentCtx);
        if (!shouldProceed) return;
      }

      // 새 컨텍스트 계산
      const updatedContext =
        typeof newContext === 'function'
          ? newContext(currentCtx)
          : { ...currentCtx, ...newContext };

      // 다음 스텝 결정
      let targetStepId: string;
      if (nextStepId) {
        targetStepId = nextStepId;
      } else {
        // 명시적 스텝 ID가 없으면 다음 순서 스텝으로
        const nextIndex = currentStepIndex + 1;
        if (nextIndex >= steps.length) {
          // 마지막 스텝이면 complete 호출
          onComplete?.(updatedContext);
          return;
        }
        targetStepId = steps[nextIndex].id;
      }

      // 히스토리에 추가
      const newEntry: HistoryEntry<TContext> = {
        stepId: targetStepId,
        context: updatedContext,
      };

      setHistoryStack((prev) => {
        // 현재 인덱스 이후의 히스토리는 버림 (forward history 제거)
        const newStack = prev.slice(0, historyIndex + 1);
        return [...newStack, newEntry];
      });
      setHistoryIndex((prev) => prev + 1);

      // onEnter 콜백 실행
      const targetStep = steps.find((s) => s.id === targetStepId);
      if (targetStep?.onEnter) {
        await targetStep.onEnter(updatedContext);
      }
    },
    [historyStack, historyIndex, currentStep, currentStepIndex, steps, onComplete]
  );

  // 현재 스텝 컨텍스트 업데이트
  const replace = useCallback(
    (newContext: Partial<TContext> | ((prev: TContext) => TContext)) => {
      setHistoryStack((prev) => {
        const newStack = [...prev];
        const currentCtx = newStack[historyIndex].context;
        const updatedContext =
          typeof newContext === 'function'
            ? newContext(currentCtx)
            : { ...currentCtx, ...newContext };
        newStack[historyIndex] = {
          ...newStack[historyIndex],
          context: updatedContext,
        };
        return newStack;
      });
    },
    [historyIndex]
  );

  // 이전 스텝으로 이동
  const back = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  // 특정 인덱스로 이동
  const go = useCallback(
    (index: number) => {
      if (index >= 0 && index < historyStack.length) {
        setHistoryIndex(index);
      }
    },
    [historyStack.length]
  );

  const history = useMemo(
    () => ({ push, replace, back, go }),
    [push, replace, back, go]
  );

  return {
    currentStep: currentEntry.stepId as TStepId,
    currentIndex: currentStepIndex,
    context: currentEntry.context,
    step: currentStep,
    history,
    isFirst,
    isLast,
    totalSteps: steps.length,
    historySteps: historyStack,
  };
}
