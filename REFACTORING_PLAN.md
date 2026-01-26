# Nyangtodac FE 리팩토링 계획서

> **작성일**: 2026-01-26
> **작업 브랜치**: `refactor`
> **목표**: 코드 신뢰도 향상 및 구조적 문제 해결

---

## 목차

1. [Critical - 즉시 해결 필요](#critical---즉시-해결-필요)
2. [High - 우선순위 높음](#high---우선순위-높음)
3. [Medium - 중요 개선사항](#medium---중요-개선사항)
4. [Low - 점진적 개선](#low---점진적-개선)
5. [작업 순서 권장안](#작업-순서-권장안)

---

## Critical - 즉시 해결 필요

### 1. Expo API 함수 반환 타입 부재

**파일**: `/apps/expo/src/lib/api/user.ts`

**현재 상태**:
```typescript
// user.ts - 반환 타입 없음
getUser: async () => {
  const response = await apiClient.get('/users');
  return response;  // any 반환
}

// auth-context.tsx에서 사용 시
const user = await userAPI.getUser();  // user: any
const name = user.name;  // 타입 체크 불가
```

**문제점**:
- `userAPI.getUser()` 반환 타입이 `any`
- 인증 컨텍스트에서 사용자 정보 접근 시 타입 검증 불가
- 런타임에 프로퍼티 접근 오류 발생 가능

**체크리스트**:
- [x] `User` 인터페이스 정의
- [x] `userAPI.getUser()` 반환 타입 `Promise<User>` 명시
- [x] `userAPI.sendFeedback()` 반환 타입 명시
- [x] `auth-context.tsx`에서 타입 안전하게 사용하도록 수정

---

### 2. @pado/bridge DATA 페이로드 `any` 타입

**파일**: `/packages/bridge/index.ts`

**현재 상태**:
```typescript
[WEBVIEW_MESSAGE_TYPE.DATA]: {
  data: any;  // 타입 안전성 완전 상실
}
```

**문제점**:
- 웹뷰에서 네이티브로 전송하는 모든 데이터가 타입 검증 없음
- 각 ACT 단계별로 다른 데이터 구조를 보내는데 통합 타입 없음
- Expo 앱에서 `onData` 핸들러가 받는 데이터 구조 예측 불가

**체크리스트**:
- [ ] 각 ACT 단계별 데이터 페이로드 인터페이스 정의
  - [ ] `DetachDataPayload`
  - [ ] `ActionDataPayload`
  - [ ] `DiaryDataPayload`
  - [ ] `EmbraceDataPayload`
  - [ ] `AnchorDataPayload`
- [ ] `WebViewMessagePayload[DATA]`를 유니온 타입으로 변경
- [ ] 각 웹 훅에서 타입에 맞는 데이터 전송하도록 수정

---

### ~~3. chatAPI.getChatHistory() 응답 구조 불일치~~

**파일**: `/apps/expo/src/lib/api/chat.ts`

**현재 상태**:
```typescript
// apiClient 인터셉터가 response.data를 자동 반환하는데
getChatHistory: async (): Promise<ChatAPI> => {
  const response: { content: ChatAPI } = await apiClient.get(ROUTES.CHATS);
  return response.content;  // 이미 unwrap된 상태에서 .content 접근
}
```

**문제점**:
- `apiClient` 인터셉터가 `response.data`를 자동 반환
- API 함수에서 `response.content` 접근 시 실제 데이터 구조와 불일치
- 런타임에 `undefined` 반환 가능

**체크리스트**:
- [ ] 백엔드 API 응답 구조 확인 (래핑 여부)
- [ ] `apiClient` 인터셉터 동작 방식 문서화
- [ ] 모든 API 함수에서 응답 구조 일관되게 처리
- [ ] API 응답 타입과 실제 반환값 일치시키기

---

### 4. auth.ts axios 타입 어노테이션 오류

**파일**: `/apps/expo/src/lib/api/auth.ts`

**현재 상태**:
```typescript
const response: { accessToken: string; refreshToken: string } =
  await axios.post(combineUrl(ENV.BASE_URL, ROUTES.REFRESH), { ... });

return response.data;  // AxiosResponse에서 .data 접근하지만 타입 어노테이션 불일치
```

**문제점**:
- `axios.post()` 반환값은 `AxiosResponse<T>` 타입
- `response` 변수의 타입 어노테이션이 응답 본문 타입으로 되어 있어 불일치
- TypeScript 타입 시스템을 우회하고 있음

**체크리스트**:
- [x] `axios.post<T>()` 제네릭 활용하도록 수정
- [ ] ~~또는 `apiClient` 사용으로 통일~~ (interceptor 우회 필요로 axios 직접 사용 유지)
- [x] `reissueAuthToken`, `getGoogleAccessToken`, `getKaKaoAccessToken` 모두 수정

---

## High - 우선순위 높음

### 5. 웹뷰-네이티브 통신 규격 미비

**파일**: `/packages/bridge/index.ts`, `/apps/expo/src/lib/webview.ts`, `/apps/web/src/lib/webview.ts`

**현재 상태**:
```typescript
// NAVIGATE 액션이 문자열로만 정의
[WEBVIEW_MESSAGE_TYPE.NAVIGATE]: {
  action: string;  // 'NEXT', 'HOME', 'BACK', 'LOGIN' 중 하나여야 함
  step?: number;   // 선택적이지만 일관되게 사용 안 됨
  duration: number;
}

// HAPTIC 타입도 문자열
[WEBVIEW_MESSAGE_TYPE.HAPTIC]: {
  type: string;  // 'NAVIGATE' | 'EFFECT' | 'SELECT' 여야 함
}
```

**문제점**:
- 액션 값 오타 시 컴파일 타임에 감지 불가
- `step` 필드가 선택적이지만 analytics 추적에 영향
- ERROR 타입이 정의되어 있으나 사용 사례 없음

**체크리스트**:
- [ ] `NavigateAction` 유니온 타입 정의: `'NEXT' | 'HOME' | 'BACK' | 'LOGIN'`
- [ ] `HapticType` 유니온 타입 정의: `'NAVIGATE' | 'EFFECT' | 'SELECT'`
- [ ] `step` 필드 사용 규칙 명확화 및 일관되게 적용
- [ ] ERROR 메시지 타입 활용 방안 정의 또는 제거
- [ ] 통신 규격 명세서 작성

---

### 6. 웹 퍼널 상태 관리 일관성 부족

**파일**: `/apps/web/src/features/act/*/hooks/use*Step.ts`

**현재 상태**:
- 각 퍼널마다 다른 상태 관리 패턴
- DETACH: `useCallback` 다용, 의존성 배열 복잡
- ACTION: `useMemo`로 계산된 값 많음
- DIARY: History 카드 관리로 또 다른 패턴
- EMBRACE: Framer Motion `MotionValue` 직접 사용

**문제점**:
- 퍼널 간 코드 재사용 어려움
- 새 퍼널 추가 시 참고할 표준 패턴 부재
- 유지보수 복잡도 증가

**체크리스트**:
- [ ] 퍼널 공통 인터페이스 정의
  ```typescript
  interface FunnelStep {
    id: string | number;
    i18nKey: string;
  }
  interface UseFunnelStepReturn {
    stepIndex: number;
    step: FunnelStep;
    handleNext: () => void;
    handlePrev: () => void;
    isNextDisabled: boolean;
  }
  ```
- [ ] 공통 `useFunnelStep` 훅 추출
- [ ] 각 퍼널을 공통 패턴으로 리팩토링

---

### 7. Window 전역 객체 타입 정의 부재

**파일**: `/apps/web/src/app/act/*/result/View.tsx`

**현재 상태**:
```typescript
// Result 페이지에서 window 객체로 데이터 접근
const data = window.detachResult;   // any
const data = window.actionResult;   // any
const data = window.diaryResult;    // any
```

**문제점**:
- `window` 객체에 동적으로 데이터 할당하는 방식이 타입 안전하지 않음
- TypeScript에서 컴파일 경고 없음
- 런타임에 `undefined` 접근 가능

**체크리스트**:
- [x] `global.d.ts` 파일 생성
  ```typescript
  declare global {
    interface Window {
      detachResult?: UserTextToken[];
      actionResult?: ActionResult;
      diaryResult?: string;
      embraceResult?: number;
      anchorResult?: AnchorResult;
      topInsets?: number;
      ReactNativeWebView?: {
        postMessage: (message: string) => void;
      };
    }
  }
  ```
- [x] 각 Result View에서 타입 가드 추가 (선택적 프로퍼티로 정의하여 `undefined` 체크 강제)

---

### 8. Step ID 타입 불일치

**파일**: `/apps/web/src/features/act/*/types/*.ts`

**현재 상태**:
```typescript
// DETACH: id는 number (0, 1)
{ id: 0, i18nKey: '...' }

// ACTION: id는 number (1, 2, 3, 4) - 0부터 시작 안 함
{ id: 1, i18nKey: '...' }

// ANCHOR: id는 string ('step1', 'step2', ...)
{ id: 'step1', i18nKey: '...', count: 5 }
```

**문제점**:
- 일관성 부족으로 코드 리팩토링 시 혼동
- 제너릭 퍼널 컴포넌트 만들기 어려움

**체크리스트**:
- [ ] Step ID 타입 통일 규칙 정의 (0부터 시작하는 number 권장)
- [ ] 모든 ACT 단계 Step 타입 통일
- [ ] ANCHOR의 `count` 같은 추가 필드는 확장 인터페이스로 분리

---

## Medium - 중요 개선사항

### 9. 시맨틱 토큰 불완전 연결 ✅

**파일**: `/packages/tailwind-semantic-tokens/`, `/packages/tailwind-design-tokens/`

**현재 상태**:
```javascript
// 일부 색상이 디자인 토큰 참조 대신 직접 정의
'--bg-act-page': '#DEE4E9',
'--btn-act-page': '#FF8A65',

// 일부 CSS 변수는 Tailwind 클래스로 접근 불가
backgroundColor: {
  page: 'var(--bg-page)',
  // 누락: 'chat-overlay': 'var(--bg-chat-overlay)'
}

// textColor에 일부 시맨틱 변수 누락
textColor: {
  body: 'var(--text-primary)',
  sub: 'var(--text-secondary)',
  // 누락: tertiary, inverse 등
}
```

**문제점**:
- 하드코딩된 색상값은 토큰 변경 시 누락될 수 있음
- 일부 시맨틱 토큰이 Tailwind 클래스로 사용 불가 (인라인 스타일만 가능)
- 토큰 사용 가이드 부재

**체크리스트**:
- [x] 모든 하드코딩된 색상을 디자인 토큰 참조로 변경
  - `colors.act.page`, `colors.act.button` 추가 후 시맨틱 토큰에서 참조
  - 다크모드 토큰도 추가 (`colors.act.pageDark`, `colors.act.buttonDark`)
- [x] 누락된 시맨틱 토큰 Tailwind 클래스 매핑 추가
  - [x] `backgroundColor` 전체 커버리지 확인
  - [x] `textColor` 전체 커버리지 확인
  - [x] `borderColor` 전체 커버리지 확인
- [x] 불필요한 시맨틱 토큰 정리 (btn-primary-*, btn-secondary-*, btn-destructive-*, cbt-* 제거)
- [ ] 토큰 사용 가이드 문서 작성 (→ #18 문서화로 이동)
- [ ] 앱별 `tailwind.config` 구조 통일 (→ 별도 작업)

---

### 10. Props Drilling 과다

**파일**: `/apps/web/src/app/act/action/step/StepContent.tsx` 등

**현재 상태**:
```typescript
// ActionStepPage에서 11개 props 전달
<StepContent
  stepIndex={stepIndex}
  selectedValue={selectedValue}
  selectedDomain={selectedDomain}
  lowestDomains={lowestDomains}
  orientation={orientation}
  obstacle={obstacle}
  action={action}
  onSelectValue={handleSelectValue}
  onSelectDomain={handleSelectDomain}
  onOrientationChange={handleOrientationChange}
  onObstacleChange={handleObstacleChange}
  onActionChange={handleActionChange}
/>
```

**문제점**:
- 깊은 props 체인으로 유지보수 어려움
- 새 prop 추가 시 모든 중간 컴포넌트 수정 필요

**체크리스트**:
- [ ] 퍼널별 Context 또는 Zustand 스토어 도입 검토
- [ ] ACTION 퍼널 props drilling 제거
- [ ] 다른 퍼널들도 동일 패턴 적용

---

### 11. 뒤로 가기(handlePrevStep) 로직 불일치

**파일**: `/apps/web/src/features/act/*/hooks/use*Step.ts`

**현재 상태**:
```typescript
// DETACH: 이전 선택 완전 초기화
handlePrevStep: () => {
  setStepIndex(currentStepIndex - 1);
  setUserTextTokens([]);  // 선택 삭제
}

// DIARY: 마지막 항목만 제거
handlePrevStep: () => {
  setHistoryCards(historyCards.slice(0, -1));
  setStepIndex(stepIndex - 1);
}
```

**문제점**:
- 퍼널마다 다른 뒤로 가기 동작으로 사용자 경험 불일치
- 데이터 복원 정책 불명확

**체크리스트**:
- [ ] 뒤로 가기 정책 명확화 (이전 입력 유지 vs 초기화)
- [ ] 정책에 따라 모든 퍼널 동작 통일
- [ ] 사용자에게 "데이터가 초기화됩니다" 같은 안내 필요 여부 검토

---

### 12. 테스트에서 `as any` 사용

**파일**: `/apps/expo/src/lib/api/chat.test.ts` 등

**현재 상태**:
```typescript
const params = {
  symptom: 'ANXIETY' as any,
  intensity: 'HIGH' as any,
  trigger: 'WORK' as any,
};
```

**문제점**:
- 테스트에서 타입 검증을 우회하여 실제 타입 오류 감지 불가
- 테스트가 타입 안전성 보장하지 못함

**체크리스트**:
- [ ] `CBTRecommendationParams` 등 테스트용 타입 정의 확인
- [ ] 모든 `as any` 제거하고 proper 타입 사용
- [ ] `as unknown as` 패턴도 정리

---

### 13. Console 문 정리

**현재 상태**:
- 약 49개의 `console.log/error/warn` 구문 존재
- 프로덕션 환경에서 불필요한 로깅

**체크리스트**:
- [ ] 개발용 console.log 모두 제거
- [ ] 에러 로깅은 통합 로깅 시스템으로 대체 (PostHog 등)
- [ ] ESLint 규칙으로 console 사용 경고 설정

---

### 14. TODO 주석 해결

**현재 상태**:
```typescript
// TODO: offline-first save
// 위치: apps/expo/app/(act)/*/result.tsx (5개 파일)
```

**체크리스트**:
- [ ] 오프라인 저장 필요성 재검토
- [ ] 필요하다면 구현 계획 수립
- [ ] 불필요하다면 TODO 주석 제거

---

## Low - 점진적 개선

### 15. Apple 로그인 미완성 코드

**파일**: `/apps/expo/src/lib/auth/auth-context.tsx`

**현재 상태**:
```typescript
} else if (platform === 'apple') {
  const result = await SignInWithApple();
  // 주석 처리된 코드...
}
```

**체크리스트**:
- [ ] Apple 로그인 지원 여부 결정
- [ ] 지원한다면 구현 완성
- [ ] 지원하지 않는다면 관련 코드 완전 제거

---

### 16. Embrace 퍼널 복잡도

**파일**: `/apps/web/src/features/act/embrace/hooks/useBreathAnimation.ts`

**현재 상태**:
- 복잡한 `await` 체이닝
- Framer Motion과 `setTimeout` 혼용
- 진동 간격 관리 분리
- 애니메이션 중단 시 정리 로직 부재

**체크리스트**:
- [ ] 애니메이션 로직 분리 및 단순화
- [ ] cleanup 함수 추가 (컴포넌트 언마운트 시)
- [ ] 상태 머신 패턴 도입 검토

---

### 17. 웹뷰 에러 핸들링 강화

**파일**: `/apps/expo/src/lib/webview.ts`

**현재 상태**:
```typescript
return (event: WebViewMessageEvent) => {
  const parsedData = JSON.parse(event.nativeEvent.data);
  // JSON.parse 실패 시 예외 처리 없음
  // 핸들러 실행 중 에러 처리 없음
};
```

**체크리스트**:
- [ ] JSON 파싱 try-catch 추가
- [ ] 핸들러 실행 에러 처리 추가
- [ ] 유효하지 않은 메시지 타입 처리

---

### 18. 문서화

**체크리스트**:
- [ ] 통신 규격 명세서 (`BRIDGE_SPEC.md`)
- [ ] 토큰 시스템 사용 가이드 (`DESIGN_TOKENS.md`)
- [ ] API 클라이언트 사용 가이드 (인터셉터 동작 방식)
- [ ] 퍼널 구현 가이드 (공통 패턴 설명)

---

## 작업 순서 권장안

### Phase 1: 타입 안전성 확보 (Critical/High)

1. **Bridge 패키지 타입 강화** (#2, #5)
   - DATA 페이로드 타입 정의
   - NAVIGATE 액션 유니온 타입
   - Window 전역 타입 정의 (#7)

2. **API 타입 수정** (#1, #3, #4)
   - userAPI 반환 타입
   - apiClient 응답 처리 통일
   - auth.ts axios 타입 수정

### Phase 2: 퍼널 구조 개선 (High/Medium)

3. **공통 퍼널 훅 추출** (#6, #8)
   - FunnelStep 인터페이스 정의
   - useFunnelStep 공통 훅
   - Step ID 타입 통일

4. **Props Drilling 제거** (#10, #11)
   - 퍼널별 Context 또는 상태 관리 도입
   - 뒤로 가기 로직 통일

### Phase 3: 토큰 시스템 정비 (Medium)

5. **시맨틱 토큰 완성** (#9)
   - 누락된 Tailwind 매핑 추가
   - 하드코딩 색상 토큰화
   - tailwind.config 구조 통일

### Phase 4: 코드 품질 개선 (Medium/Low)

6. **테스트 및 코드 정리** (#12, #13, #14)
   - as any 제거
   - console 문 정리
   - TODO 해결

7. **기타 개선** (#15, #16, #17, #18)
   - Apple 로그인 결정
   - Embrace 퍼널 리팩토링
   - 코드의 전체적인 응집도, 결합도, 가독성, 예측 가능성 고려해서 리펙토링
   - 문서화

---

## 진행 상황 추적

| Phase | 항목 | 상태 | 담당자 | 완료일 |
|-------|------|------|-------|-------|
| 1 | Bridge 타입 강화 | [ ] 미시작 | - | - |
| 1 | API 타입 수정 | [x] 완료 (#1, #4) | - | 2026-01-27 |
| 2 | 공통 퍼널 훅 | [ ] 미시작 | - | - |
| 2 | Props Drilling 제거 | [ ] 미시작 | - | - |
| 3 | 시맨틱 토큰 | [x] 완료 (#9) | - | 2026-01-27 |
| 4 | 코드 품질 | [ ] 미시작 | - | - |
| 4 | 기타 개선 | [ ] 미시작 | - | - |

---

*이 문서는 리팩토링 진행에 따라 지속적으로 업데이트됩니다.*
