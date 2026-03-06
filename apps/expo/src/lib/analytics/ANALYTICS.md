# Analytics Event Documentation

## 전체 흐름

```
앱 설치 → 온보딩 → 로그인 → 홈 → 콘텐츠 사용
```

각 단계에서 발생하는 이벤트와 측정 의도를 설명합니다.

---

## 1. 온보딩 (Onboarding)

**파일**: `features/onboard/OnboardScreen.tsx`

유저가 앱을 처음 설치하고 진입하는 흐름. 온보딩 완료율과 이탈 지점을 측정합니다.

| 이벤트 | 속성 | 시점 | 의도 |
|--------|------|------|------|
| `pado_onboard_start` | — | 온보딩 화면 마운트 | 온보딩 진입 수 측정. 설치 대비 온보딩 도달률 확인 |
| `pado_funnel_next` | title, duration, step | 각 단계 진행 | 어떤 단계에서 시간을 오래 쓰는지, 어디서 멈추는지 |
| `pado_onboard_complete` | duration | 온보딩 완료 | 온보딩 전체 소요시간. 완료율 = complete / start |

### Funnel
```
pado_onboard_start → pado_funnel_next (step 0~N) → pado_onboard_complete
```

### 배치 의도
- `start`: useEffect로 화면 마운트 시 1회 발생. 온보딩에 도달했는지 확인
- `next`: 기존 ACT 세션과 동일한 이벤트 재사용. title="온보딩"으로 구분
- `complete`: 마지막 단계 통과 시. 로그인 화면으로 이동 직전에 발생

---

## 2. 로그인 (Login)

**파일**: `app/login.tsx`

로그인 방식별 전환율과 실패 원인을 측정합니다.

| 이벤트 | 속성 | 시점 | 의도 |
|--------|------|------|------|
| `pado_login_attempt` | method | 로그인 버튼 클릭 | 어떤 로그인 방식을 시도하는지 |
| `pado_login_success` | method | 로그인 성공 | 방식별 성공률 = success / attempt |
| `pado_login_fail` | method, error | 로그인 실패 | 실패 원인 파악 (네트워크, 권한, 취소 등) |

### method 값
- `apple`: Apple 로그인
- `google`: Google 로그인
- `kakao`: Kakao 로그인 (KR 지역만)

### Funnel
```
pado_login_attempt → pado_login_success
```

### 배치 의도
- `attempt`: 버튼 클릭 즉시. 로그인 SDK 호출 전
- `success`: SDK + 서버 인증 완료 후, 홈 이동 직전
- `fail`: SDK 에러 반환 시. cancelled는 추적하지 않음 (유저 의도적 취소)

---

## 3. 유저 식별 (Identify)

**파일**: `features/home/hooks/useAuthInit.ts`

| 이벤트 | 속성 | 시점 | 의도 |
|--------|------|------|------|
| `identify` | name, email | 홈 화면 최초 마운트 | PostHog에서 유저 단위 분석 가능하게 함 |

### 배치 의도
- 홈 화면 진입 시 1회만 실행 (useRef로 중복 방지)
- email을 distinctId로 사용하여 디바이스 간 유저 통합

---

## 4. 페이지 뷰 (Page View)

**파일**: `features/home/hooks/useHomePageState.ts`

| 이벤트 | 속성 | 시점 | 의도 |
|--------|------|------|------|
| `pado_page_view` | page | 탭 전환 시 | 어떤 섹션을 많이 사용하는지. 기능별 관심도 측정 |

### page 값
- `HOME`: 메인 (ACT 카드 목록)
- `HISTORY`: 파도 기록
- `CHAT`: 채팅
- `LEARNING`: 학습

### 배치 의도
- setPage 호출 시 자동 트래킹. 별도 호출 필요 없음
- 첫 진입(HOME)은 트래킹하지 않음 — 탭 전환만 추적

---

## 5. ACT 세션 (Content Funnel)

**파일**: `features/act/{anchor,diary,detach,embrace,action}/*Screen.tsx`

ACT 콘텐츠의 진입부터 완료까지 전체 퍼널을 측정합니다.

| 이벤트 | 속성 | 시점 | 의도 |
|--------|------|------|------|
| `pado_content_click` | title | 홈에서 ACT 카드 클릭 | 콘텐츠별 관심도. 클릭 수 ≠ 시작 수 |
| `pado_funnel_intro_next` | title, duration | 인트로에서 "시작" 버튼 | 인트로 → 시작 전환율 |
| `pado_funnel_intro_exit` | title, duration | 인트로에서 나감 | 인트로 이탈률. 인트로 체류시간 |
| `pado_funnel_next` | title, duration, step | 단계 진행 | 단계별 소요시간 |
| `pado_funnel_prev` | title, duration, step | 이전 단계 | 어떤 단계에서 되돌아가는지 |
| `pado_funnel_exit` | title, duration, step | 세션 도중 나감 | 어떤 단계에서 이탈하는지 |
| `pado_funnel_complete` | title, duration | 결과 화면에서 완료 | 세션 완료율. 전체 소요시간 |

### title 값 (ANALYTICS_KEY)
- `5-4-3-2-1`: Anchor (현재에 집중하기)
- `감정 일기`: Diary
- `생각과 사실 분리하기`: Detach
- `호흡법`: Embrace
- `가치와 전념행동`: Action

### Funnel
```
pado_content_click → pado_funnel_intro_next → pado_funnel_next (step 1~N) → pado_funnel_complete
```

### 이탈 분기
```
                    ├→ pado_funnel_intro_exit (인트로에서 나감)
                    ├→ pado_funnel_exit (세션 도중 나감)
```

### 배치 의도
- `content_click`: 홈 ActStep 컴포넌트에서 카드 클릭 시. slug를 title로 전달
- `intro_next/exit`: 인트로 화면의 "시작"/"닫기" 버튼
- `next/prev/exit`: 각 Step 화면의 네비게이션 버튼
- `complete`: Result 화면의 "완료" 버튼. 서버 API 호출 후 발생
- `duration`: 이전 이벤트(또는 화면 마운트)부터 현재까지 경과 초. useDuration 훅으로 측정

---

## 6. 채팅 (Chat)

**파일**: `features/chat/components/ChatSection.tsx`, `ChatHeader.tsx`

| 이벤트 | 속성 | 시점 | 의도 |
|--------|------|------|------|
| `pado_chat_enter` | — | 채팅 화면 마운트 | 채팅 진입 수 |
| `pado_chat_send` | — | 메시지 전송 | 실제 사용 수. 진입 대비 메시지 전송율 |
| `pado_chat_exit` | duration | 채팅 나감 | 채팅 체류시간 (초) |

### Funnel
```
pado_chat_enter → pado_chat_send → pado_chat_exit
```

### 배치 의도
- `enter`: ChatSection useEffect로 마운트 시 1회
- `send`: 메시지 전송 함수 내. 빈 메시지/할당량 초과 시에는 발생하지 않음
- `exit`: ChatHeader 뒤로가기 버튼. enter 시점부터의 duration 전달

---

## 7. 학습 (Learning)

**파일**: `app/learning.tsx`, `features/learning/components/LearningCard.tsx`

| 이벤트 | 속성 | 시점 | 의도 |
|--------|------|------|------|
| `pado_content_click` | title | 학습 카드 클릭 | ACT와 동일한 이벤트. title로 구분 |
| `pado_funnel_next` | title, duration, step | WebView 내 다음 버튼 | 학습 단계별 진행 |
| `pado_learning_complete` | title, duration | 학습 완료 (홈으로 돌아감) | 학습 콘텐츠 완료율 |

### Funnel
```
pado_content_click → pado_funnel_next (step 0~N) → pado_learning_complete
```

### 배치 의도
- `content_click`: LearningCard 클릭 시. i18n 기반 analyticsKey 사용
- `funnel_next`: WebView에서 NAVIGATE/NEXT 메시지 수신 시
- `learning_complete`: WebView에서 HOME 메시지 수신 시 (마지막 단계)

---

## 8. 푸시 알림 (Push Notification)

**파일**: `hooks/usePushNotification.ts`

| 이벤트 | 속성 | 시점 | 의도 |
|--------|------|------|------|
| `pado_push_opened` | campaign? | 알림 탭으로 앱 열 때 | 푸시 알림 효과 측정. 캠페인별 반응률 |

### 배치 의도
- 앱이 백그라운드일 때: `onNotificationOpenedApp` 콜백
- 앱이 종료 상태일 때: `getInitialNotification` 체크
- campaign 속성은 서버에서 푸시 보낼 때 data에 포함시키면 자동으로 잡힘

---

## PostHog에서 만들 수 있는 주요 Funnel

### 전체 유저 여정
```
pado_onboard_start → pado_onboard_complete → pado_login_success → pado_content_click → pado_funnel_complete
```

### 온보딩 → 로그인
```
pado_onboard_start → pado_onboard_complete → pado_login_attempt → pado_login_success
```

### ACT 콘텐츠 전환율 (title 필터 사용)
```
pado_content_click → pado_funnel_intro_next → pado_funnel_complete
```

### 채팅 참여도
```
pado_chat_enter → pado_chat_send
```

### 리텐션 측정
- Retention 탭에서 `pado_page_view` 또는 `pado_content_click`을 returning event로 설정
- 푸시 알림 효과: `pado_push_opened` 이후 `pado_content_click` 발생 여부

---

## duration 측정 방식

`useDuration` 훅 (`lib/analytics/useDuration.ts`):
- 컴포넌트 마운트 시 `Date.now()` 저장
- `getDuration()` 호출 시 경과 초 반환 + 자동 리셋
- `resetDuration()`으로 수동 리셋

채팅은 별도로 `useRef(Date.now())`로 진입 시간 저장 → exit 시 계산.
