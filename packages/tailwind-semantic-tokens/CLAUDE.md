# 디자인 시스템 가이드

## 아키텍처
```
tailwind-design-tokens/    → 기본 색상 팔레트, 간격, 타이포그래피
tailwind-semantic-tokens/  → CSS 변수 기반 시맨틱 토큰 (light/dark)
```

## 다크모드
- **클래스 기반**: `darkMode: 'class'` — NativeWind에서 `dark:` prefix 사용
- `:root`에 light 변수, `:root.dark`에 dark 변수 주입
- **절대 `useColorScheme` + `semanticColors.dark/light`로 분기하지 않음** (NativeWind가 처리)
- NativeWind 미지원 컴포넌트(Skia, 외부 라이브러리 아이콘)만 예외적으로 JS 분기 허용

## 색상 사용 우선순위
```
1순위: className="bg-act-page text-body border-default"  (NativeWind 시맨틱 클래스)
2순위: className="bg-white/50 dark:bg-white/5"           (NativeWind 유틸리티 + dark: 분기)
3순위: useIconColor() 훅                                  (아이콘 동적 색상)
4순위: tokens['--토큰명'] + inline style                   (NativeWind 미지원 시에만)
```

## ⚠️ 토큰 값에 hex alpha 붙이기 금지
토큰 값이 8자리 hex(`#fc8a67ff`)를 포함할 수 있음.
`${accent}40` → `#fc8a67ff40` = **유효하지 않은 색상**.

**투명도가 필요하면:**
```tsx
// ✅ NativeWind opacity modifier
className="bg-btn-act-page/25"

// ✅ hex-to-rgba 헬퍼 (inline style 필수 시)
import { hexToRgba } from '@src/lib/theme/utils';
style={{ backgroundColor: hexToRgba(accent, 0.25) }}

// ❌ 절대 금지
style={{ backgroundColor: `${accent}40` }}
```

## 주요 시맨틱 토큰

### 배경
| 클래스 | 용도 |
|--------|------|
| `bg-page` | 페이지 배경 |
| `bg-surface` | 서피스 (카드 등) |
| `bg-elevated` | 엘리베이션 |
| `bg-act-page` | ACT 페이지 배경 |
| `bg-btn-act-page` | ACT 버튼 (accent) |
| `bg-act-input` | ACT 입력 배경 |

### 텍스트
| 클래스 | 용도 |
|--------|------|
| `text-body` | 본문 (`--text-primary`) |
| `text-sub` | 보조 (`--text-secondary`) |
| `text-tertiary` | 3차 (`--text-tertiary`) |
| `text-disabled` | 비활성 |
| `text-inverse` | 반전 (항상 흰색/검정) |

### 보더
| 클래스 | 용도 |
|--------|------|
| `border-default` | 기본 보더 |
| `border-subtle` | 미세한 구분선 |
| `border-focus` | 포커스 상태 |

### ACT 전용
| 토큰 | Light | Dark |
|------|-------|------|
| `--bg-act-page` | `#E8ECF8` | `#1A1E24` |
| `--btn-act-page` | `#fc8a67ff` | `#D88068` |
| `--btn-act-page-selected` | `#3B5B88` | `#5A82AE` |
| `--act-input-bg` | `rgba(220,225,245,0.5)` | `rgba(255,255,255,0.05)` |

## 카드/입력 패턴 (ACT 페이지)
```tsx
// 카드/입력 — 반투명 + dark: 분기
className="rounded-2xl border border-white bg-white/50 dark:border-white/10 dark:bg-white/5"

// 항상 dark 배경 위 (캘린더, 챗)
style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}  // dark 전용이라 분기 불필요
```

## 간격
- 8pt 그리드 준수
- `gap-5`(20px) 사용 금지 → `gap-4`(16px) 또는 `gap-6`(24px)
