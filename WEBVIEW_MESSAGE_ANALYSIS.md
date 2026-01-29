# 웹뷰-네이티브 메시지 통신 분석

> **작성일**: 2026-01-30
> **목적**: 웹뷰-네이티브 메시지 통신 로직 전체 분석 및 문제점 파악

---

## 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [핵심 파일 구조](#핵심-파일-구조)
3. [메시지 타입 정의](#메시지-타입-정의)
4. [웹 → 네이티브 메시지 전송](#웹--네이티브-메시지-전송)
5. [네이티브 메시지 수신 및 처리](#네이티브-메시지-수신-및-처리)
6. [ACT 단계별 메시지 사용 현황](#act-단계별-메시지-사용-현황)
7. [문제점 분석 (REFACTORING_PLAN.md 연계)](#문제점-분석-refactoring_planmd-연계)
8. [메시지 사용 위치 목록](#메시지-사용-위치-목록)

---

## 아키텍처 개요

### 통신 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                    웹 애플리케이션 (Next.js)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ACT 단계 Hooks                                      │   │
│  │  useDetachStep / useActionStep / useDiaryStep 등     │   │
│  └─────────────────┬───────────────────────────────────┘   │
│                    │                                        │
│  ┌─────────────────▼───────────────────────────────────┐   │
│  │  handlePostMessage(type, data)                       │   │
│  │  - 웹뷰 환경 체크                                    │   │
│  │  - JSON 직렬화                                       │   │
│  └─────────────────┬───────────────────────────────────┘   │
│                    │                                        │
│  ┌─────────────────▼───────────────────────────────────┐   │
│  │  window.ReactNativeWebView.postMessage(jsonString)   │   │
│  └─────────────────┬───────────────────────────────────┘   │
└────────────────────┼────────────────────────────────────────┘
                     │
     ════════════════╪════════════════════════════════════
         WebView 브릿지 (JSON 문자열 메시지)
     ════════════════╪════════════════════════════════════
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 네이티브 앱 (Expo/React Native)              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  WebView.onMessage                                   │   │
│  │  createWebViewMessageHandler() 호출                   │   │
│  └─────────────────┬───────────────────────────────────┘   │
│                    │                                        │
│  ┌─────────────────▼───────────────────────────────────┐   │
│  │  JSON.parse(event.nativeEvent.data)                  │   │
│  │  메시지 타입별 핸들러 라우팅                          │   │
│  └─────────────────┬───────────────────────────────────┘   │
│                    │                                        │
│  ┌─────────────────▼───────────────────────────────────┐   │
│  │  핸들러 실행                                         │   │
│  │  ├─ HAPTIC    → triggerHaptic() 자동 실행            │   │
│  │  ├─ NAVIGATE  → onNavigate() → router.push/replace   │   │
│  │  ├─ DATA      → onData() → 결과 페이지 라우팅         │   │
│  │  ├─ VALIDATE  → onValidate() → showAlert 표시        │   │
│  │  └─ ERROR     → onError() (미구현)                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 핵심 파일 구조

```
packages/
└── bridge/
    └── index.ts              # 메시지 타입 정의 (중앙집중)

apps/
├── web/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── webview.ts    # handlePostMessage() 구현
│   │   │   └── haptic.ts     # triggerHaptic() 래퍼
│   │   ├── types/
│   │   │   └── global.d.ts   # Window 인터페이스 확장
│   │   └── features/
│   │       └── act/
│   │           ├── detach/hooks/useDetachStep.ts
│   │           ├── action/hooks/useActionStep.ts
│   │           ├── diary/hooks/useDiaryStep.ts
│   │           ├── embrace/components/EmbraceStepHeader.tsx
│   │           └── anchor/hooks/useAnchorStep.ts
│
└── expo/
    ├── src/
    │   └── lib/
    │       └── webview.ts    # createWebViewMessageHandler() 구현
    └── app/
        └── (act)/
            ├── detach/
            │   ├── index.tsx  # BASE 화면
            │   └── step.tsx   # STEP 화면
            ├── action/
            │   ├── index.tsx
            │   └── step.tsx
            ├── diary/
            │   ├── index.tsx
            │   └── step.tsx
            ├── embrace/
            │   ├── index.tsx
            │   └── step.tsx
            └── anchor/
                ├── index.tsx
                └── step.tsx
```

---

## 메시지 타입 정의

### 파일 위치: `/packages/bridge/index.ts`

### 메시지 타입 상수

```typescript
export const WEBVIEW_MESSAGE_TYPE = {
  NAVIGATE: 'NAVIGATE',
  DATA: 'DATA',
  ERROR: 'ERROR',
  HAPTIC: 'HAPTIC',
  VALIDATE: 'VALIDATE',
} as const;
```

### 페이로드 타입 정의

```typescript
export type WebViewMessagePayload = {
  [WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {
    action: string;      // 'NEXT' | 'HOME' | 'BACK' | 'RESULT' | 'LOGIN'
    step?: number;       // 선택적 - 분석 추적용
    duration: number;    // 단계 소요 시간 (초)
  };
  [WEBVIEW_MESSAGE_TYPE.DATA]: {
    data: any;           // ⚠️ any 타입 - 타입 안전성 없음
  };
  [WEBVIEW_MESSAGE_TYPE.ERROR]: {
    error: string;
  };
  [WEBVIEW_MESSAGE_TYPE.HAPTIC]: {
    type: string;        // 'NAVIGATE' | 'EFFECT' | 'SELECT'
  };
  [WEBVIEW_MESSAGE_TYPE.VALIDATE]: {
    title: string;
    message: string;
  };
};
```

### 메시지 타입 용도

| 타입 | 용도 | 방향 |
|------|------|------|
| **NAVIGATE** | 페이지 이동, 뒤로가기, 홈으로 등 | 웹 → 네이티브 |
| **DATA** | ACT 완료 후 결과 데이터 전송 | 웹 → 네이티브 |
| **ERROR** | 에러 발생 시 전송 (미사용) | 웹 → 네이티브 |
| **HAPTIC** | 진동 피드백 트리거 | 웹 → 네이티브 |
| **VALIDATE** | 유효성 검증 실패 알림 | 웹 → 네이티브 |

---

## 웹 → 네이티브 메시지 전송

### 파일 위치: `/apps/web/src/lib/webview.ts`

### handlePostMessage 구현

```typescript
export const handlePostMessage = <T extends WebViewMessageType>(
  type: T,
  data: WebViewMessagePayload[T],
) => {
  // 1. 웹뷰 환경 체크
  const isNativeWebView =
    typeof window !== 'undefined' && !!window.ReactNativeWebView;

  if (!isNativeWebView) {
    throw new Error(`${type} 메시지를 전송할 수 없습니다.`);
  }

  // 2. 메시지 생성 및 전송
  const message: WebViewMessage<T> = { type, data };
  window.ReactNativeWebView!.postMessage(JSON.stringify(message));
};
```

### 전역 타입 정의: `/apps/web/src/types/global.d.ts`

```typescript
declare global {
  interface Window {
    // 웹뷰 통신용
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };

    // Safe Area Insets (네이티브에서 주입)
    topInsets?: number;

    // ACT 결과 데이터 (현재 미사용)
    detachResult?: UserTextToken[];
    actionResult?: ActionResult;
    diaryResult?: string;
    embraceResult?: number;
    anchorResult?: AnchorResult;
  }
}
```

### haptic.ts 래퍼

```typescript
// /apps/web/src/lib/haptic.ts
export const triggerHaptic = (type: 'NAVIGATE' | 'EFFECT' | 'SELECT') => {
  try {
    handlePostMessage(WEBVIEW_MESSAGE_TYPE.HAPTIC, { type });
  } catch {
    // 웹뷰 환경이 아닐 때 무시
  }
};
```

---

## 네이티브 메시지 수신 및 처리

### 파일 위치: `/apps/expo/src/lib/webview.ts`

### createWebViewMessageHandler 구현

```typescript
export const createWebViewMessageHandler = (
  handlers: {
    onNavigate?: (action: string, duration: number, step?: number) => void;
    onData?: (data: unknown) => void;
    onError?: (error: string) => void;
    onValidate?: (title: string, message: string) => void;
  } = {},
) => {
  return (event: WebViewMessageEvent) => {
    // 1. JSON 파싱 (try-catch 없음 ⚠️)
    const parsedData = JSON.parse(event.nativeEvent.data);
    const { type, data } = parsedData;

    // 2. HAPTIC은 핸들러 없이 자동 처리
    if (type === WEBVIEW_MESSAGE_TYPE.HAPTIC) {
      const hapticType = data?.type as 'NAVIGATE' | 'EFFECT' | 'SELECT' | undefined;
      triggerHaptic(hapticType || 'SELECT');
      return;
    }

    // 3. 다른 메시지는 핸들러 호출
    if (type === WEBVIEW_MESSAGE_TYPE.NAVIGATE && handlers.onNavigate) {
      handlers.onNavigate(data.action, data.duration, data.step);
    } else if (type === WEBVIEW_MESSAGE_TYPE.DATA && handlers.onData) {
      handlers.onData(data);
    } else if (type === WEBVIEW_MESSAGE_TYPE.ERROR && handlers.onError) {
      handlers.onError(data.error);
    } else if (type === WEBVIEW_MESSAGE_TYPE.VALIDATE && handlers.onValidate) {
      handlers.onValidate(data.title, data.message);
    }
  };
};
```

### 네이티브 화면별 핸들러 패턴

#### BASE 화면 (소개 페이지)

```typescript
// /apps/expo/app/(act)/detach/index.tsx
const handleMessage = createWebViewMessageHandler({
  onNavigate: (action, duration) => {
    if (action === 'NEXT') {
      router.push(ROUTES.ACT.DETACH.STEP);
    }
    if (action === 'HOME') {
      router.replace(ROUTES.HOME);
    }
  },
});
```

#### STEP 화면 (실제 작업 페이지)

```typescript
// /apps/expo/app/(act)/detach/step.tsx
const handleMessage = createWebViewMessageHandler({
  onNavigate: (action, duration, step) => {
    if (action === 'BACK') {
      router.back();
    }
    if (action === 'HOME') {
      router.replace(ROUTES.HOME);
      trackFunnelExit(ANALYTICS_KEY.DETACH, duration, step);
    }
    if (action === 'NEXT') {
      trackFunnelNext(ANALYTICS_KEY.DETACH, duration, step);
    }
  },
  onData: (payload) => {
    const { data } = payload as { data: unknown };  // ⚠️ 타입 캐스팅
    router.push({
      pathname: ROUTES.ACT.DETACH.RESULT,
      params: { data: safeStringify(data) },
    });
  },
  onValidate: (title, message) => {
    showAlert.validation(title, message);
  },
});
```

---

## ACT 단계별 메시지 사용 현황

### DETACH (감정 분리)

#### 웹 Hook: `/apps/web/src/features/act/detach/hooks/useDetachStep.ts`

| 동작 | 메시지 타입 | 페이로드 |
|------|------------|----------|
| 텍스트 입력 후 다음 | HAPTIC + NAVIGATE | `{ type: 'NAVIGATE' }` + `{ action: 'NEXT', duration }` |
| 100자 초과 시 | VALIDATE | `{ title, message }` |
| 토큰 선택 후 다음 | HAPTIC + NAVIGATE | 동일 |
| 최종 완료 | HAPTIC + DATA | `{ data: UserTextToken[] }` |
| 홈으로 | NAVIGATE | `{ action: 'HOME', duration }` |
| 뒤로가기 | NAVIGATE 또는 로컬 상태 | `{ action: 'BACK', duration }` |

#### 네이티브 핸들러 위치

- BASE: `/apps/expo/app/(act)/detach/index.tsx`
- STEP: `/apps/expo/app/(act)/detach/step.tsx`

#### DATA 페이로드 구조

```typescript
type DetachData = UserTextToken[];  // 선택된 토큰 배열

interface UserTextToken {
  text: string;
  isSelected: boolean;
}
```

---

### ACTION (행동 계획)

#### 웹 Hook: `/apps/web/src/features/act/action/hooks/useActionStep.ts`

| 동작 | 메시지 타입 | 페이로드 |
|------|------------|----------|
| 가치 선택 후 다음 | HAPTIC + NAVIGATE | `{ action: 'NEXT', duration, step }` |
| 방향성 입력 (500자 초과) | VALIDATE | `{ title, message }` |
| 방향성 입력 후 다음 | HAPTIC + NAVIGATE | 동일 |
| 장애물 입력 후 다음 | HAPTIC + NAVIGATE | 동일 |
| 행동 입력 후 다음 | HAPTIC + NAVIGATE | 동일 |
| 최종 완료 | HAPTIC + DATA | `{ data: ActionResult }` |
| 홈으로 | NAVIGATE | `{ action: 'HOME', duration }` |
| 뒤로가기 | 로컬 상태만 변경 | - |

#### 네이티브 핸들러 위치

- BASE: `/apps/expo/app/(act)/action/index.tsx`
- STEP: `/apps/expo/app/(act)/action/step.tsx`

#### DATA 페이로드 구조

```typescript
interface ActionData {
  selectedValue: string;      // 선택한 가치
  selectedDomain: string;     // 선택한 영역
  orientation: string;        // 방향성 텍스트
  obstacle: string;           // 장애물 텍스트
  action: string;             // 행동 텍스트
}
```

---

### DIARY (감정 일기)

#### 웹 Hook: `/apps/web/src/features/act/diary/hooks/useDiaryStep.ts`

| 동작 | 메시지 타입 | 페이로드 |
|------|------------|----------|
| 질문 답변 후 다음 | HAPTIC + NAVIGATE | `{ action: 'NEXT', duration, step }` |
| 500자 초과 시 | VALIDATE | `{ title, message }` |
| 최종 완료 | HAPTIC + DATA | `{ data: string }` (JSON 문자열) |
| 홈으로 | NAVIGATE | `{ action: 'HOME', duration }` |
| 뒤로가기 | NAVIGATE | `{ action: 'BACK', duration }` |

#### 네이티브 핸들러 위치

- BASE: `/apps/expo/app/(act)/diary/index.tsx`
- STEP: `/apps/expo/app/(act)/diary/step.tsx`

#### DATA 페이로드 구조

```typescript
// 웹에서 safeStringify()로 직렬화하여 전송
type DiaryData = string;  // JSON.stringify된 HistoryCard[]

interface HistoryCard {
  question: string;
  answer: string;
}
```

---

### EMBRACE (감정 수용 - 호흡)

#### 웹 컴포넌트: `/apps/web/src/features/act/embrace/components/EmbraceStepHeader.tsx`

| 동작 | 메시지 타입 | 페이로드 |
|------|------------|----------|
| 뒤로가기 | NAVIGATE | `{ action: 'BACK', duration: 0, step: 0 }` |
| 홈으로 | NAVIGATE | `{ action: 'HOME', duration: 0, step: 0 }` |
| 호흡 완료 | DATA | `{ data: { embraceResult: number } }` |

#### 네이티브 핸들러 위치

- BASE: `/apps/expo/app/(act)/embrace/index.tsx`
- STEP: `/apps/expo/app/(act)/embrace/step.tsx`

#### DATA 페이로드 구조

```typescript
interface EmbraceData {
  embraceResult: number;  // 호흡 시간 (초)
}
```

#### 특이사항

- Safe Area Insets를 `injectedJavaScriptBeforeContentLoaded`로 주입
```typescript
injectedJavaScriptBeforeContentLoaded={`window.topInsets = ${insets.top};`}
```

---

### ANCHOR (일일 목표)

#### 웹 Hook: `/apps/web/src/features/act/anchor/hooks/useAnchorStep.ts`

| 동작 | 메시지 타입 | 페이로드 |
|------|------------|----------|
| 선택 후 다음 | HAPTIC + NAVIGATE | `{ action: 'NEXT', duration, step }` |
| 최종 완료 | NAVIGATE | `{ action: 'RESULT', duration, step }` |
| 홈으로 | NAVIGATE | `{ action: 'HOME', duration }` |
| 뒤로가기 | NAVIGATE | `{ action: 'BACK', duration }` |

#### 네이티브 핸들러 위치

- BASE: `/apps/expo/app/(act)/anchor/index.tsx`
- STEP: `/apps/expo/app/(act)/anchor/step.tsx`

#### DATA 페이로드

- ANCHOR는 DATA 메시지를 사용하지 않음
- 선택된 값들은 네이티브에서 별도로 관리하거나 RESULT 페이지에서 처리

---

### ONBOARD (온보딩)

#### 웹 컴포넌트: `/apps/web/src/features/onboard/View.tsx`

| 동작 | 메시지 타입 | 페이로드 |
|------|------------|----------|
| 단계별 다음 | HAPTIC + NAVIGATE | `{ action: 'NEXT', duration, step }` |
| 로그인으로 | HAPTIC + NAVIGATE | `{ action: 'LOGIN', duration, step }` |

#### 네이티브 핸들러 위치

- `/apps/expo/app/onboard.tsx`

---

### LEARNING (학습)

#### 웹 Hook: `/apps/web/src/features/learning/hooks/useLearningStep.ts`

| 동작 | 메시지 타입 | 페이로드 |
|------|------------|----------|
| 단계별 다음 | HAPTIC + NAVIGATE | `{ action: 'NEXT', duration, step }` |
| 최종 완료 | HAPTIC + DATA | `{ data: LearningResult }` |
| 홈으로 | NAVIGATE | `{ action: 'HOME', duration }` |

#### 네이티브 핸들러 위치

- `/apps/expo/app/learning.tsx`

---

## 문제점 분석 (REFACTORING_PLAN.md 연계)

### 문제 #2: DATA 페이로드 `any` 타입

#### 문제 위치

**정의**: `/packages/bridge/index.ts:15`

```typescript
[WEBVIEW_MESSAGE_TYPE.DATA]: {
  data: any;  // ⚠️ 타입 안전성 완전 상실
}
```

#### 발생 현상

1. **웹에서 전송하는 데이터 구조가 단계별로 상이**

```typescript
// DETACH - 배열 직접 전송
handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
  data: userTextTokens  // UserTextToken[]
});

// DIARY - JSON 문자열로 전송
handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
  data: safeStringify([...historyCards])  // string
});

// ACTION - 객체로 전송
handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
  data: { selectedValue, selectedDomain, orientation, obstacle, action }  // ActionResult
});

// EMBRACE - 객체로 전송
handlePostMessage(WEBVIEW_MESSAGE_TYPE.DATA, {
  data: { embraceResult: number }
});
```

2. **네이티브에서 수동 타입 캐스팅 필요**

```typescript
// /apps/expo/app/(act)/detach/step.tsx:45
onData: (payload) => {
  const { data } = payload as { data: unknown };  // 타입 캐스팅
  // data의 실제 구조를 알 수 없음
}
```

3. **런타임 에러 가능성**

- 웹에서 잘못된 구조의 데이터를 전송해도 컴파일 타임에 감지 불가
- 네이티브에서 예상과 다른 구조의 데이터를 받으면 런타임 에러 발생

#### 영향 받는 파일

| 파일 | 역할 |
|------|------|
| `/packages/bridge/index.ts` | 타입 정의 |
| `/apps/web/src/features/act/*/hooks/use*Step.ts` | DATA 메시지 전송 |
| `/apps/expo/app/(act)/*/step.tsx` | DATA 메시지 수신 |

---

### 문제 #5: 웹뷰-네이티브 통신 규격 미비

#### 문제 위치

**정의**: `/packages/bridge/index.ts:8-14`

```typescript
[WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {
  action: string;      // ⚠️ 리터럴 타입이 아닌 string
  step?: number;
  duration: number;
};

[WEBVIEW_MESSAGE_TYPE.HAPTIC]: {
  type: string;        // ⚠️ 리터럴 타입이 아닌 string
};
```

#### 발생 현상

1. **NAVIGATE action 값이 문자열로 정의**

실제 사용되는 action 값:
- `'NEXT'` - 다음 단계로
- `'HOME'` - 홈으로
- `'BACK'` - 뒤로가기
- `'RESULT'` - 결과 페이지로 (ANCHOR에서만)
- `'LOGIN'` - 로그인 페이지로 (온보딩에서만)

```typescript
// 웹에서 오타가 있어도 컴파일 에러 없음
handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
  action: 'NEXTT',  // ⚠️ 오타지만 string이라 통과
  duration: 0,
});
```

2. **HAPTIC type 값이 문자열로 정의**

실제 사용되는 type 값:
- `'NAVIGATE'` - 네비게이션 시 (강한 진동)
- `'EFFECT'` - 효과 발생 시 (중간 진동)
- `'SELECT'` - 선택 시 (약한 진동)

```typescript
// 네이티브에서 타입 캐스팅으로 처리
const hapticType = data?.type as 'NAVIGATE' | 'EFFECT' | 'SELECT' | undefined;
triggerHaptic(hapticType || 'SELECT');
```

3. **step 필드 사용 불일치**

```typescript
// DETACH - step 사용 안 함
handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
  action: 'NEXT',
  duration: stepDuration,
  // step 없음
});

// ACTION - step 사용
handlePostMessage(WEBVIEW_MESSAGE_TYPE.NAVIGATE, {
  action: 'NEXT',
  step: stepIndex,
  duration: stepDuration,
});
```

4. **ERROR 타입 미사용**

```typescript
// bridge/index.ts에 정의되어 있지만
[WEBVIEW_MESSAGE_TYPE.ERROR]: {
  error: string;
};

// 실제로 사용하는 곳 없음 (grep 결과 0건)
```

#### 영향 받는 파일

| 파일 | 문제 |
|------|------|
| `/packages/bridge/index.ts` | action, type이 string |
| `/apps/web/src/features/act/*/hooks/*.ts` | 오타 감지 불가 |
| `/apps/expo/src/lib/webview.ts` | 타입 캐스팅 필요 |

---

### 문제 #7: Window 전역 객체 타입 정의 부재 (부분 해결)

#### 문제 위치

**정의**: `/apps/web/src/types/global.d.ts`

```typescript
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    topInsets?: number;

    // 아래 프로퍼티들은 정의되어 있지만 실제 사용되지 않음
    detachResult?: UserTextToken[];
    actionResult?: ActionResult;
    diaryResult?: string;
    embraceResult?: number;
    anchorResult?: AnchorResult;
  }
}
```

#### 발생 현상

1. **미사용 전역 변수 정의**

`detachResult`, `actionResult`, `diaryResult`, `embraceResult`, `anchorResult`는 정의되어 있지만:
- 실제로 값이 할당되는 곳 없음
- 읽는 곳도 없음
- postMessage를 통해서만 데이터 전송

2. **topInsets 주입 방식**

```typescript
// /apps/expo/app/(act)/embrace/step.tsx
<WebView
  injectedJavaScriptBeforeContentLoaded={`window.topInsets = ${insets.top};`}
/>
```

- 네이티브에서 JavaScript 주입으로 설정
- 웹에서 `window.topInsets`로 접근
- 타입은 정의되어 있으나 주입 여부 불확실

#### 영향 받는 파일

| 파일 | 문제 |
|------|------|
| `/apps/web/src/types/global.d.ts` | 미사용 타입 정의 |
| `/apps/expo/app/(act)/embrace/step.tsx` | topInsets 주입 |
| `/apps/web/src/features/act/embrace/*` | topInsets 사용 |

---

### 문제 #17: 웹뷰 에러 핸들링 강화 필요

#### 문제 위치

**정의**: `/apps/expo/src/lib/webview.ts:17-42`

```typescript
export const createWebViewMessageHandler = (handlers = {}) => {
  return (event: WebViewMessageEvent) => {
    // ⚠️ try-catch 없음
    const parsedData = JSON.parse(event.nativeEvent.data);
    const { type, data } = parsedData;

    // ⚠️ 유효하지 않은 type 처리 없음
    if (type === WEBVIEW_MESSAGE_TYPE.NAVIGATE && handlers.onNavigate) {
      handlers.onNavigate(data.action, data.duration, data.step);
    }
    // ... 나머지 핸들러
  };
};
```

#### 발생 현상

1. **JSON 파싱 실패 시 예외 처리 없음**

```typescript
// 잘못된 JSON이 전송되면 크래시
window.ReactNativeWebView.postMessage('not a json');
// → JSON.parse 에러 발생, 앱 크래시 가능
```

2. **핸들러 실행 중 에러 처리 없음**

```typescript
onData: (payload) => {
  const { data } = payload as { data: unknown };
  // data.someProperty 접근 시 에러 발생 가능
  // 에러 발생해도 처리 없음
}
```

3. **유효하지 않은 메시지 타입 처리 없음**

```typescript
// 정의되지 않은 type이 전송되면 무시됨
{ type: 'UNKNOWN', data: {} }
// → 아무 핸들러도 호출되지 않고 조용히 무시
```

4. **ERROR 메시지 핸들러 미구현**

```typescript
// onError 핸들러가 정의되어 있지만
// 웹에서 ERROR 메시지를 보내는 곳 없음
// 네이티브에서 onError 핸들러를 설정하는 곳 없음
```

#### 영향 받는 파일

| 파일 | 문제 |
|------|------|
| `/apps/expo/src/lib/webview.ts` | try-catch 없음 |
| `/apps/expo/app/(act)/*/step.tsx` | 핸들러 에러 처리 없음 |
| `/apps/web/src/lib/webview.ts` | ERROR 메시지 미전송 |

---

## 메시지 사용 위치 목록

### 웹에서 postMessage 호출 위치

#### Hook 파일 (주요 로직)

| 파일 | 메시지 타입 |
|------|------------|
| `/apps/web/src/features/act/detach/hooks/useDetachStep.ts` | NAVIGATE, DATA, VALIDATE |
| `/apps/web/src/features/act/action/hooks/useActionStep.ts` | NAVIGATE, DATA, VALIDATE |
| `/apps/web/src/features/act/diary/hooks/useDiaryStep.ts` | NAVIGATE, DATA, VALIDATE |
| `/apps/web/src/features/act/anchor/hooks/useAnchorStep.ts` | NAVIGATE, VALIDATE |
| `/apps/web/src/features/learning/hooks/useLearningStep.ts` | NAVIGATE, DATA |

#### 컴포넌트 파일

| 파일 | 메시지 타입 |
|------|------------|
| `/apps/web/src/features/onboard/View.tsx` | NAVIGATE |
| `/apps/web/src/features/act/embrace/components/EmbraceStepHeader.tsx` | NAVIGATE |

#### 유틸리티 파일

| 파일 | 메시지 타입 |
|------|------------|
| `/apps/web/src/lib/haptic.ts` | HAPTIC |

### 네이티브에서 메시지 핸들러 위치

#### BASE 화면 (소개 페이지)

| 파일 | 핸들러 |
|------|--------|
| `/apps/expo/app/(act)/detach/index.tsx` | onNavigate |
| `/apps/expo/app/(act)/action/index.tsx` | onNavigate |
| `/apps/expo/app/(act)/diary/index.tsx` | onNavigate |
| `/apps/expo/app/(act)/embrace/index.tsx` | onNavigate |
| `/apps/expo/app/(act)/anchor/index.tsx` | onNavigate |

#### STEP 화면 (실제 작업 페이지)

| 파일 | 핸들러 |
|------|--------|
| `/apps/expo/app/(act)/detach/step.tsx` | onNavigate, onData, onValidate |
| `/apps/expo/app/(act)/action/step.tsx` | onNavigate, onData, onValidate |
| `/apps/expo/app/(act)/diary/step.tsx` | onNavigate, onData, onValidate |
| `/apps/expo/app/(act)/embrace/step.tsx` | onNavigate, onData |
| `/apps/expo/app/(act)/anchor/step.tsx` | onNavigate, onValidate |

#### 특수 화면

| 파일 | 핸들러 |
|------|--------|
| `/apps/expo/app/onboard.tsx` | onNavigate |
| `/apps/expo/app/learning.tsx` | onNavigate |

---

## 부록: 메시지 타입별 사용 횟수

| 메시지 타입 | 웹 전송 횟수 | 네이티브 처리 위치 |
|------------|-------------|------------------|
| NAVIGATE | ~15회 | 모든 화면 |
| DATA | ~6회 | step.tsx 파일들 |
| VALIDATE | ~4회 | step.tsx 파일들 |
| HAPTIC | ~10회 (triggerHaptic 호출) | 자동 처리 |
| ERROR | 0회 | 미사용 |

---

*이 문서는 웹뷰-네이티브 메시지 통신 시스템의 현재 상태를 분석한 것입니다. REFACTORING_PLAN.md의 관련 이슈와 연계하여 참고하세요.*
