# 선언적 퍼널 아키텍처로의 전환

> React Native 앱에서 명령형 퍼널 구조를 선언적 구조로 리팩토링한 경험을 정리합니다.

## 목차

1. [기존 퍼널 구조의 문제점](#1-기존-퍼널-구조의-문제점)
2. [선택 가능한 퍼널 아키텍처들](#2-선택-가능한-퍼널-아키텍처들)
3. [toss/use-funnel 스타일을 선택한 이유](#3-tossuse-funnel-스타일을-선택한-이유)
4. [실제 리팩토링 과정](#4-실제-리팩토링-과정)
5. [결론](#5-결론)

---

## 1. 기존 퍼널 구조의 문제점

### 1.1 전체 아키텍처

기존 온보딩은 **웹뷰 기반**으로 구현되어 있었습니다.

```
┌─────────────────────────────────────────────────────────────┐
│  Native (Expo)                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  WebView                                             │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  Next.js Web App                            │    │   │
│  │  │  - 온보딩 UI 렌더링                          │    │   │
│  │  │  - 스텝 상태 관리                            │    │   │
│  │  │  - 애니메이션 처리                           │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↕ postMessage                      │
│  네이티브 핸들러 (라우팅, 분석)                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 기존 코드 구조

```
apps/web/src/features/onboard/
├── View.tsx              # 660줄의 거대한 메인 컴포넌트
├── constants/
│   └── index.ts          # 매직 넘버들
├── hooks/
│   ├── useOnboardBreathing.ts
│   └── useOnboardWave.ts
├── components/
│   ├── StepContent.tsx
│   ├── BreathContent.tsx
│   └── WaveCanvas.tsx
└── types/
    └── index.ts
```

### 1.3 핵심 문제점

#### 문제 1: 명령형 분기 처리

```typescript
// View.tsx - handleNext 함수
const handleNext = async () => {
  triggerHaptic('NAVIGATE');
  setShowButton(false);

  const step = currentStep;

  // 문제: if-else 체인으로 스텝별 로직 분기
  if (currentStep === BREATHING_STEP_INDEX) {  // 매직 넘버 6
    const completed = await startBreathing();
    if (completed) {
      handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
        action: 'NEXT',
        step,
        duration: getDuration(),
      });
      setCurrentStep((prev) => prev + 1);
    }
    return;
  }

  if (isLastStep) {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
      action: 'LOGIN',
      step,
      duration: getDuration(),
    });
    return;
  }

  // 일반 스텝
  handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
    action: 'NEXT',
    step,
    duration: getDuration(),
  });

  setIsExiting(true);

  // 문제: setTimeout으로 수동 타이밍 관리
  setTimeout(() => {
    if (currentStep < STEP_COUNT - 1) {
      setCurrentStep((prev) => prev + 1);
      setIsExiting(false);
    }
  }, FADE_OUT_DURATION * 1000);
};
```

**문제점:**
- 스텝 인덱스(6)가 하드코딩됨
- 새 스텝 추가 시 모든 조건문 검토 필요
- 흐름 파악을 위해 함수 전체를 읽어야 함

#### 문제 2: 상태 관리 분산

```typescript
// View.tsx - 4개의 독립적인 useState
const [currentStep, setCurrentStep] = useState(0);
const [isExiting, setIsExiting] = useState(false);
const [showButton, setShowButton] = useState(false);
const [visibleTexts, setVisibleTexts] = useState<number[]>([]);
```

**문제점:**
- 상태들이 서로 의존하지만 독립적으로 관리됨
- 상태 동기화 버그 발생 가능성
- 디버깅 시 여러 상태를 추적해야 함

#### 문제 3: 스텝 정의 분산

```typescript
// constants/index.ts - 숫자만 있음
export const STEP_COUNT = 8;
export const BREATHING_STEP_INDEX = 6;

// View.tsx - i18n 키로 데이터 조회
const getStep = (index: number): Step => {
  const stepKey = `onboard.steps.step${index + 1}`;
  return {
    texts: t(`${stepKey}.texts`, { returnObjects: true }),
    buttonText: t(`${stepKey}.button`),
  };
};

// useOnboardBreathing.ts - 호흡 로직은 또 다른 곳
if (currentStep === BREATHING_STEP_INDEX) {
  await startBreathing();
}
```

**문제점:**
- 스텝이 뭐가 있는지 파악하려면 여러 파일을 봐야 함
- `BREATHING_STEP_INDEX = 6`이 무슨 스텝인지 알려면 i18n 파일까지 확인 필요
- 스텝 순서 변경 시 인덱스 수동 업데이트 필요

#### 문제 4: 웹뷰 의존성

```typescript
// 네이티브와 웹 간 메시지 통신 필요
handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
  action: 'NEXT',
  step,
  duration: getDuration(),
});

// 네이티브에서 수신
const handleMessage = createWebViewMessageHandler({
  onNavigate: (action, duration, step) => {
    if (action === 'LOGIN') {
      setIsOnboarded(true);
      router.replace(ROUTES.LOGIN);
    }
  },
});
```

**문제점:**
- 오프라인에서 동작 불가
- 웹뷰 로딩 시간 필요
- 네이티브-웹 간 상태 동기화 복잡성

---

## 2. 선택 가능한 퍼널 아키텍처들

### 2.1 옵션 1: 설정 기반 (Config-driven)

```typescript
const onboardFunnel = defineFunnel({
  id: 'onboard',
  steps: [
    {
      id: 'welcome',
      component: WelcomeStep,
      validate: (ctx) => true,  // 항상 통과
    },
    {
      id: 'breathing',
      component: BreathingStep,
      onNext: async (ctx) => {
        await performBreathing();
        return true;
      },
    },
    {
      id: 'complete',
      component: CompleteStep,
    },
  ],
  onComplete: (ctx) => navigateToLogin(),
});

// 사용
function OnboardScreen() {
  const { currentStep, next, back } = useFunnel(onboardFunnel);
  const StepComponent = currentStep.component;

  return <StepComponent onNext={next} onBack={back} />;
}
```

| 장점 | 단점 |
|------|------|
| 한 파일에서 전체 흐름 파악 | 복잡한 조건부 흐름 표현 제한 |
| 검증/전환 로직 명시적 | 컴포넌트와 설정 분리로 추적 어려움 |
| 타입 안전 | 동적 스텝 추가 어려움 |

### 2.2 옵션 2: 상태 머신 기반 (XState 스타일)

```typescript
const onboardMachine = createMachine({
  id: 'onboard',
  initial: 'welcome',
  context: {},
  states: {
    welcome: {
      on: {
        NEXT: 'needs1',
        EXIT: { actions: 'navigateHome' },
      },
    },
    needs1: {
      on: {
        NEXT: 'needs2',
        BACK: 'welcome',
      },
    },
    breathing: {
      on: {
        NEXT: {
          target: 'complete',
          guard: 'breathingCompleted',
        },
      },
      invoke: {
        src: 'breathingService',
        onDone: { actions: 'setBreathingComplete' },
      },
    },
    complete: {
      type: 'final',
      entry: 'navigateToLogin',
    },
  },
});

// 사용
function OnboardScreen() {
  const [state, send] = useMachine(onboardMachine);

  return (
    <>
      {state.matches('welcome') && <Welcome onNext={() => send('NEXT')} />}
      {state.matches('breathing') && <Breathing />}
      {/* ... */}
    </>
  );
}
```

| 장점 | 단점 |
|------|------|
| 복잡한 분기/조건부 흐름 표현 | 러닝 커브 높음 |
| 시각화 도구 지원 (XState Viz) | 단순한 선형 흐름에는 오버헤드 |
| 불가능한 상태 방지 | 보일러플레이트 많음 |

### 2.3 옵션 3: 컴포넌트 기반 (toss/use-funnel 스타일)

```typescript
function OnboardFunnel() {
  const funnel = useFunnel<OnboardContext>({
    id: 'onboard',
    initial: { step: 'welcome', context: {} },
  });

  return (
    <funnel.Render
      welcome={({ history }) => (
        <WelcomeStep
          onNext={() => history.push('needs1')}
        />
      )}

      breathing={({ history }) => (
        <BreathingStep
          onComplete={() => history.push('complete')}
        />
      )}

      complete={({ history }) => (
        <CompleteStep
          onFinish={() => navigateToLogin()}
        />
      )}
    />
  );
}
```

| 장점 | 단점 |
|------|------|
| React 친화적 | 렌더 prop 패턴이 장황할 수 있음 |
| 타입 안전 (각 스텝별 context 타입) | 대규모 퍼널에서 파일 비대 |
| 히스토리 관리 내장 | - |
| 선언적이면서 유연함 | - |

### 2.4 옵션 4: 하이브리드 (설정 + 훅)

```typescript
// 스텝 정의는 설정으로
const ONBOARD_STEPS = [
  { id: 'welcome', meta: { i18nKey: 'onboard.steps.step1' } },
  { id: 'breathing', meta: { i18nKey: '...', isBreathingStep: true } },
  { id: 'complete', meta: { i18nKey: '...', isFinalStep: true } },
] as const;

// 훅에서 상태 관리
const funnel = useFunnel({
  steps: ONBOARD_STEPS,
  initialContext: {},
  onComplete: () => navigateToLogin(),
});

// 컴포넌트에서 현재 스텝에 따라 렌더링
function OnboardScreen() {
  const { currentStep, step, history } = funnel;
  const meta = step.meta;

  if (meta.isBreathingStep && isBreathing) {
    return <BreathingContent />;
  }

  return <StepContent onNext={() => history.push()} />;
}
```

| 장점 | 단점 |
|------|------|
| 설정과 로직 분리 | 구현 복잡도 증가 |
| 유연한 확장 | 두 가지 패턴 혼용 |
| 기존 코드와 점진적 통합 용이 | - |

---

## 3. toss/use-funnel 스타일을 선택한 이유

### 3.1 프로젝트 특성 분석

| 특성 | 현재 상태 | 적합한 패턴 |
|------|-----------|-------------|
| 퍼널 복잡도 | 선형 흐름 (분기 거의 없음) | 설정 기반 / 컴포넌트 기반 |
| 데이터 수집 | 없음 (정보 전달 위주) | 단순한 context로 충분 |
| 특수 스텝 | 호흡 운동 1개 | 커스텀 로직 지원 필요 |
| 기술 스택 | React Native / TypeScript | React 친화적 패턴 |
| 팀 규모 | 소규모 | 러닝 커브 낮은 것 선호 |

### 3.2 선택 이유

#### 이유 1: 선형 흐름에 최적화

온보딩은 8개 스텝이 순차적으로 진행되는 단순한 구조입니다.
XState 같은 상태 머신은 복잡한 분기가 있을 때 빛을 발하지만,
선형 흐름에서는 오버헤드만 증가합니다.

```typescript
// 상태 머신: 단순 흐름에도 많은 보일러플레이트
states: {
  step1: { on: { NEXT: 'step2' } },
  step2: { on: { NEXT: 'step3', BACK: 'step1' } },
  step3: { on: { NEXT: 'step4', BACK: 'step2' } },
  // ... 8개 반복
}

// use-funnel 스타일: 배열로 간단히 정의
const steps = [
  { id: 'step1' },
  { id: 'step2' },
  { id: 'step3' },
  // ...
];
```

#### 이유 2: 타입 안전성

toss/use-funnel의 핵심 장점은 **스텝별 context 타입 강제**입니다.

```typescript
// 각 스텝에서 필요한 데이터를 타입으로 명시
type FunnelState = {
  step1: { name?: string };           // 아직 입력 안됨
  step2: { name: string; age?: number };  // name 필수
  step3: { name: string; age: number };   // 둘 다 필수
};

// 잘못된 전환은 컴파일 에러
history.push('step3', { name: 'Kim' });
// Error: age is required in step3
```

우리 온보딩은 데이터 수집이 없지만, 이후 ACT 모듈 리팩토링 시 이 장점이 빛을 발합니다.

#### 이유 3: 히스토리 관리 내장

뒤로 가기 지원이 자동으로 됩니다.

```typescript
// 직접 구현 시
const [history, setHistory] = useState([{ step: 0, data: {} }]);
const [currentIndex, setCurrentIndex] = useState(0);

const back = () => {
  if (currentIndex > 0) {
    setCurrentIndex(prev => prev - 1);
  }
};

// use-funnel 스타일
const { history } = useFunnel(...);
history.back();  // 끝
```

#### 이유 4: 네이티브 직접 구현으로 오프라인 지원

기존 웹뷰 방식을 버리고 네이티브로 직접 구현하면:
- 오프라인 동작 가능
- 웹뷰 로딩 시간 제거
- 네이티브 애니메이션/햅틱 직접 제어

---

## 4. 실제 리팩토링 과정

### 4.1 새로운 파일 구조

```
apps/expo/src/
├── hooks/
│   └── useFunnel.ts              # 범용 퍼널 훅
└── features/onboard/
    ├── index.ts                   # export
    ├── types.ts                   # 타입 정의
    ├── constants.ts               # 스텝 선언
    ├── OnboardScreen.tsx          # 메인 화면
    ├── components/
    │   ├── index.ts
    │   ├── StepContent.tsx        # 텍스트 + 버튼
    │   └── BreathContent.tsx      # 호흡 UI
    └── hooks/
        ├── index.ts
        └── useBreathing.ts        # 호흡 로직
```

### 4.2 useFunnel 훅 구현

#### 핵심 타입 정의

```typescript
// apps/expo/src/hooks/useFunnel.ts

/**
 * 퍼널의 각 스텝 정의
 */
export interface FunnelStep<TContext> {
  /** 스텝 고유 ID */
  id: string;
  /** 스텝 진입 시 실행할 비동기 작업 */
  onEnter?: (context: TContext) => Promise<void> | void;
  /** 다음 스텝으로 이동 전 실행할 비동기 작업 */
  onNext?: (context: TContext) => Promise<boolean> | boolean;
  /** 스텝별 추가 메타데이터 */
  meta?: Record<string, unknown>;
}

/**
 * useFunnel 옵션
 */
export interface UseFunnelOptions<TStepId extends string, TContext> {
  id: string;
  steps: readonly FunnelStep<TContext>[];
  initialContext: TContext;
  onComplete?: (context: TContext) => void;
}

/**
 * 히스토리 항목
 */
interface HistoryEntry<TContext> {
  stepId: string;
  context: TContext;
}
```

#### 훅 반환 타입

```typescript
export interface UseFunnelReturn<TStepId extends string, TContext> {
  /** 현재 스텝 ID */
  currentStep: TStepId;
  /** 현재 스텝 인덱스 */
  currentIndex: number;
  /** 현재 컨텍스트 */
  context: TContext;
  /** 현재 스텝 정의 객체 */
  step: FunnelStep<TContext>;
  /** 히스토리 관리 */
  history: {
    push: (nextStepId?: TStepId, newContext?: Partial<TContext>) => Promise<void>;
    replace: (newContext: Partial<TContext>) => void;
    back: () => void;
    go: (index: number) => void;
  };
  /** 상태 플래그 */
  isFirst: boolean;
  isLast: boolean;
  totalSteps: number;
}
```

#### 훅 구현

```typescript
export function useFunnel<
  TStepId extends string,
  TContext extends Record<string, unknown> = Record<string, unknown>,
>(options: UseFunnelOptions<TStepId, TContext>): UseFunnelReturn<TStepId, TContext> {
  const { steps, initialContext, onComplete } = options;

  // 히스토리 스택: 방문한 스텝과 그 시점의 context 저장
  const [historyStack, setHistoryStack] = useState<HistoryEntry<TContext>[]>([
    { stepId: steps[0].id, context: initialContext },
  ]);

  // 현재 히스토리에서의 위치 (뒤로가기 지원)
  const [historyIndex, setHistoryIndex] = useState(0);

  // 현재 상태 계산
  const currentEntry = historyStack[historyIndex];
  const currentStepIndex = steps.findIndex((s) => s.id === currentEntry.stepId);
  const currentStep = steps[currentStepIndex];

  // 다음 스텝으로 이동
  const push = useCallback(async (nextStepId?: TStepId, newContext?: Partial<TContext>) => {
    const currentCtx = historyStack[historyIndex].context;

    // 1. 현재 스텝의 onNext 콜백 실행 (있다면)
    if (currentStep.onNext) {
      const shouldProceed = await currentStep.onNext(currentCtx);
      if (!shouldProceed) return;  // false 반환 시 진행 중단
    }

    // 2. 새 컨텍스트 계산
    const updatedContext = { ...currentCtx, ...newContext };

    // 3. 다음 스텝 결정
    let targetStepId: string;
    if (nextStepId) {
      targetStepId = nextStepId;
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex >= steps.length) {
        // 마지막 스텝이면 onComplete 호출
        onComplete?.(updatedContext);
        return;
      }
      targetStepId = steps[nextIndex].id;
    }

    // 4. 히스토리에 새 항목 추가
    const newEntry: HistoryEntry<TContext> = {
      stepId: targetStepId,
      context: updatedContext,
    };

    setHistoryStack((prev) => {
      // 현재 위치 이후의 히스토리는 버림 (새 경로로 진행)
      const newStack = prev.slice(0, historyIndex + 1);
      return [...newStack, newEntry];
    });
    setHistoryIndex((prev) => prev + 1);

    // 5. 새 스텝의 onEnter 콜백 실행 (있다면)
    const targetStep = steps.find((s) => s.id === targetStepId);
    if (targetStep?.onEnter) {
      await targetStep.onEnter(updatedContext);
    }
  }, [historyStack, historyIndex, currentStep, currentStepIndex, steps, onComplete]);

  // 현재 스텝의 context만 업데이트 (스텝 이동 없음)
  const replace = useCallback((newContext: Partial<TContext>) => {
    setHistoryStack((prev) => {
      const newStack = [...prev];
      const currentCtx = newStack[historyIndex].context;
      newStack[historyIndex] = {
        ...newStack[historyIndex],
        context: { ...currentCtx, ...newContext },
      };
      return newStack;
    });
  }, [historyIndex]);

  // 이전 스텝으로 (히스토리 인덱스만 변경)
  const back = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  // 특정 인덱스로 점프
  const go = useCallback((index: number) => {
    if (index >= 0 && index < historyStack.length) {
      setHistoryIndex(index);
    }
  }, [historyStack.length]);

  return {
    currentStep: currentEntry.stepId as TStepId,
    currentIndex: currentStepIndex,
    context: currentEntry.context,
    step: currentStep,
    history: { push, replace, back, go },
    isFirst: currentStepIndex === 0,
    isLast: currentStepIndex === steps.length - 1,
    totalSteps: steps.length,
  };
}
```

### 4.3 온보딩 스텝 선언

#### 타입 정의

```typescript
// apps/expo/src/features/onboard/types.ts

/**
 * 온보딩 스텝 ID - 리터럴 타입으로 타입 안전성 확보
 */
export type OnboardStepId =
  | 'welcome'
  | 'needs1'
  | 'needs2'
  | 'actTheory'
  | 'metaphor'
  | 'startGuide'
  | 'breathing'
  | 'complete';

/**
 * 온보딩 컨텍스트 - 데이터 수집 없음
 */
export type OnboardContext = Record<string, never>;

/**
 * 스텝별 메타데이터
 */
export interface OnboardStepMeta {
  i18nKey: string;
  isBreathingStep?: boolean;
  isFinalStep?: boolean;
}
```

#### 스텝 선언 (Before vs After)

**Before: 매직 넘버와 분산된 정의**
```typescript
// constants/index.ts
export const STEP_COUNT = 8;
export const BREATHING_STEP_INDEX = 6;

// View.tsx에서 i18n으로 데이터 조회
const getStep = (index: number) => ({
  texts: t(`onboard.steps.step${index + 1}.texts`),
  buttonText: t(`onboard.steps.step${index + 1}.button`),
});
```

**After: 선언적 스텝 정의**
```typescript
// apps/expo/src/features/onboard/constants.ts

export const ONBOARD_STEPS: readonly FunnelStep<OnboardContext>[] = [
  {
    id: 'welcome',
    meta: { i18nKey: 'onboard.steps.step1' },
  },
  {
    id: 'needs1',
    meta: { i18nKey: 'onboard.steps.step2' },
  },
  {
    id: 'needs2',
    meta: { i18nKey: 'onboard.steps.step3' },
  },
  {
    id: 'actTheory',
    meta: { i18nKey: 'onboard.steps.step4' },
  },
  {
    id: 'metaphor',
    meta: { i18nKey: 'onboard.steps.step5' },
  },
  {
    id: 'startGuide',
    meta: { i18nKey: 'onboard.steps.step6' },
  },
  {
    id: 'breathing',
    meta: {
      i18nKey: 'onboard.steps.step7',
      isBreathingStep: true,  // 특수 스텝 플래그
    },
  },
  {
    id: 'complete',
    meta: {
      i18nKey: 'onboard.steps.step8',
      isFinalStep: true,
    },
  },
] as const;
```

**개선점:**
- 스텝 ID가 의미 있는 이름 (`'breathing'` vs `6`)
- 스텝별 특성이 메타데이터로 명시됨
- 배열 순서 = 퍼널 순서 (직관적)

### 4.4 메인 화면 구현

#### Before: 660줄의 View.tsx

```typescript
// 핵심 로직만 발췌
export default function OnboardView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [visibleTexts, setVisibleTexts] = useState<number[]>([]);

  // ... 50줄의 useEffect들 ...

  const handleNext = async () => {
    // ... 40줄의 if-else 로직 ...
  };

  return (
    // ... 30줄의 JSX ...
  );
}
```

#### After: OnboardScreen.tsx

```typescript
// apps/expo/src/features/onboard/OnboardScreen.tsx

export function OnboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { trackFunnelNext } = useAnalytics();
  const { getDuration, resetDuration } = useDuration();
  const { isBreathing, breathText, breathTimer, startBreathing } = useBreathing();

  // 퍼널 완료 시 로그인으로 이동
  const handleComplete = useCallback(() => {
    setIsOnboarded(true);
    router.replace(ROUTES.LOGIN);
  }, [router]);

  // useFunnel로 상태 관리 단순화
  const funnel = useFunnel<OnboardStepId, OnboardContext>({
    id: 'onboard',
    steps: ONBOARD_STEPS,
    initialContext: {},
    onComplete: handleComplete,
  });

  // 메타데이터에서 i18n 키 추출
  const meta = funnel.step.meta as OnboardStepMeta;
  const texts = t(`${meta.i18nKey}.texts`, { returnObjects: true }) as string[];
  const buttonText = t(`${meta.i18nKey}.button`);

  // 다음 스텝 핸들러 - 단순해짐
  const handleNext = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const duration = getDuration();
    trackFunnelNext(ANALYTICS_KEY.ONBOARD, duration, funnel.currentIndex);
    resetDuration();

    // 호흡 스텝 처리
    if (meta.isBreathingStep) {
      const completed = await startBreathing();
      if (completed) {
        await funnel.history.push();
      }
      return;
    }

    // 일반 스텝 또는 마지막 스텝
    await funnel.history.push();
  }, [funnel, meta.isBreathingStep, getDuration, resetDuration, trackFunnelNext, startBreathing]);

  return (
    <View
      className="flex-1 bg-[#001830]"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {isBreathing ? (
        <BreathContent breathText={breathText} timer={breathTimer} />
      ) : (
        <StepContent
          texts={texts}
          buttonText={buttonText}
          onNext={handleNext}
          stepKey={funnel.currentStep}
        />
      )}
    </View>
  );
}
```

**개선점:**
- 상태 관리가 `useFunnel` 한 곳으로 집중
- `if (currentStep === BREATHING_STEP_INDEX)` → `if (meta.isBreathingStep)`
- `history.push()`만 호출하면 다음 스텝으로 자동 이동
- 마지막 스텝에서 `push()` 호출 시 `onComplete` 자동 실행

### 4.5 UI 컴포넌트

#### StepContent - 텍스트 순차 표시

```typescript
// apps/expo/src/features/onboard/components/StepContent.tsx

interface StepContentProps {
  texts: string[];
  buttonText: string;
  onNext: () => void;
  stepKey: string;  // 스텝 변경 감지용
}

export function StepContent({ texts, buttonText, onNext, stepKey }: StepContentProps) {
  const [visibleTextCount, setVisibleTextCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const buttonOpacity = useSharedValue(0);

  // stepKey 변경 시 애니메이션 리셋 및 순차 표시
  useEffect(() => {
    setVisibleTextCount(0);
    setShowButton(false);
    buttonOpacity.value = 0;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // 각 텍스트를 600ms 간격으로 순차 표시
    texts.forEach((_, index) => {
      timeouts.push(
        setTimeout(() => setVisibleTextCount(index + 1), index * 600)
      );
    });

    // 모든 텍스트 후 버튼 표시
    timeouts.push(
      setTimeout(() => {
        setShowButton(true);
        buttonOpacity.value = withTiming(1, { duration: 600 });
      }, texts.length * 800)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [stepKey, texts, buttonOpacity]);

  return (
    <View className="flex-1 justify-between py-16">
      <View className="flex-1 justify-center items-center px-4">
        {texts.slice(0, visibleTextCount).map((text, index) => (
          <Animated.View
            key={`${stepKey}-text-${index}`}
            entering={FadeIn.duration(600)}
          >
            <Text className="text-white text-xl text-center mb-2">
              {text}
            </Text>
          </Animated.View>
        ))}
      </View>

      <Animated.View style={useAnimatedStyle(() => ({ opacity: buttonOpacity.value }))}>
        {showButton && (
          <Button text={buttonText} onPress={onNext} size="lg" />
        )}
      </Animated.View>
    </View>
  );
}
```

#### useBreathing - 호흡 운동 로직

```typescript
// apps/expo/src/features/onboard/hooks/useBreathing.ts

const BREATH = {
  INHALE: 4,   // 들이쉬기 4초
  HOLD: 7,     // 참기 7초
  EXHALE: 8,   // 내쉬기 8초
  CYCLE_COUNT: 2,
};

export function useBreathing() {
  const { t } = useTranslation();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('');
  const [breathTimer, setBreathTimer] = useState(0);

  const runBreathCycle = useCallback(async () => {
    // 들이쉬기
    setBreathText(t('onboard.breath.inhale'));
    for (let i = BREATH.INHALE; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }

    // 참기
    setBreathText(t('onboard.breath.hold'));
    for (let i = BREATH.HOLD; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }

    // 내쉬기
    setBreathText(t('onboard.breath.exhale'));
    for (let i = BREATH.EXHALE; i > 0; i--) {
      setBreathTimer(i);
      await wait(1000);
    }
  }, [t]);

  const startBreathing = useCallback(async (): Promise<boolean> => {
    setIsBreathing(true);

    await wait(1500);  // 준비 시간

    // 햅틱 피드백 시작
    const hapticInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 500);

    // 2회 반복
    for (let i = 0; i < BREATH.CYCLE_COUNT; i++) {
      await runBreathCycle();
    }

    clearInterval(hapticInterval);

    setBreathText(t('act.embrace.breath.completed'));
    await wait(1500);

    setIsBreathing(false);
    return true;
  }, [runBreathCycle, t]);

  return { isBreathing, breathText, breathTimer, startBreathing };
}
```

### 4.6 변경 전후 비교 요약

| 항목 | Before | After |
|------|--------|-------|
| **아키텍처** | 웹뷰 (Next.js) | 네이티브 (React Native) |
| **메인 파일 크기** | 660줄 | ~100줄 |
| **상태 관리** | 4개 useState 분산 | useFunnel 1개로 통합 |
| **스텝 정의** | 매직 넘버 (`BREATHING_STEP_INDEX = 6`) | 선언적 배열 + 메타데이터 |
| **스텝 전환** | if-else 체인 (40줄) | `history.push()` (1줄) |
| **특수 스텝 처리** | 인덱스 비교 | 메타데이터 플래그 확인 |
| **타입 안전성** | 약함 | 강함 (스텝 ID 리터럴 타입) |
| **오프라인 지원** | 불가 | 가능 |

---

## 5. 결론

### 5.1 핵심 교훈

1. **선언적 > 명령형**: 퍼널의 "무엇"을 정의하면 "어떻게"는 훅이 처리
2. **메타데이터 활용**: 스텝별 특성을 데이터로 표현하면 조건문이 사라짐
3. **히스토리 추상화**: 뒤로가기/앞으로가기를 직접 구현하지 않아도 됨
4. **점진적 마이그레이션**: 범용 훅을 만들면 다른 퍼널에도 재사용 가능

### 5.2 다음 단계

이 `useFunnel` 훅은 온보딩뿐 아니라 ACT 모듈에도 적용할 수 있습니다:

```typescript
// ACT Diary 퍼널 예시
const DIARY_STEPS = [
  { id: 'situation', meta: { i18nKey: 'act.diary.step1' } },
  { id: 'thoughts', meta: { i18nKey: 'act.diary.step2' } },
  { id: 'feelings', meta: { i18nKey: 'act.diary.step3' } },
] as const;

const funnel = useFunnel<DiaryStepId, DiaryContext>({
  steps: DIARY_STEPS,
  initialContext: { situation: '', thoughts: '', feelings: '' },
  onComplete: (ctx) => saveToServer(ctx),
});
```

ACT 모듈은 **데이터 수집**이 있으므로 context 타입 안전성이 더 빛을 발할 것입니다.

---

## 참고 자료

- [toss/use-funnel GitHub](https://github.com/toss/use-funnel)
- [toss/use-funnel 공식 문서](https://use-funnel.slash.page)
- [XState 공식 문서](https://xstate.js.org)
