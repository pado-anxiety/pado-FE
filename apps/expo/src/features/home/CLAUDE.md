# Home Feature

## 구조
하늘-파도-심해 3단 구성의 메인 화면:

```
home/
├── components/
│   ├── SkySection.tsx          # 상단 하늘 영역 (CBT 버튼)
│   ├── DeepSeaSection.tsx      # 하단 심해 영역 (ACT 모듈 목록)
│   ├── Wave/                   # 파도 레이어 (5개 레이어 패럴렉스)
│   │   ├── WaveHorizon.tsx     # 메인 파도 컴포넌트 (Skia Canvas)
│   │   ├── wave-path-utils.ts  # createWavePath, getExtraHeight (worklet)
│   │   ├── *Wave.tsx           # 개별 파도 레이어 (Background/Midground/Foreground)
│   │   └── index.tsx
│   ├── Act/                    # ACT 모듈 선택 UI
│   │   ├── ActList.tsx         # 5개 ACT 카드 렌더링
│   │   ├── ActStep.tsx         # 개별 ACT 카드
│   │   └── ActPath.tsx         # 카드 간 연결 SVG 경로
│   ├── CbtButton*.tsx          # CBT 버튼 그리드
│   ├── HomeListHeader.tsx      # 기록/학습 섹션 헤더
│   ├── HomeListItem.tsx        # 기록 카드 or 학습 카드 렌더
│   └── HomeListFooter.tsx
├── constants/                  # actMenuList, cbtMenuList, layout 상수
├── hooks/
│   ├── useHomePageState.tsx    # 페이지 상태 (HOME | HISTORY | CHAT | LEARNING)
│   ├── useHomeListData.ts      # 기록 + 학습 데이터 조합
│   └── useHistoryInfiniteQuery.ts  # 기록 무한 스크롤
└── types/                      # HomeListItem union type
```

## 파도 시스템
- `WaveHorizon`: @shopify/react-native-skia Canvas 기반
- 5개 레이어 (Background → MidgroundBack → Midground → ForegroundMid → Foreground)
- `useFrameCallback`으로 매 프레임 clock 업데이트
- `gapScale` SharedValue로 파도 간격 동적 조절 (온보딩에서 사용)
- geometry 함수는 `wave-path-utils.ts`에 분리 (`'worklet'` 디렉티브 유지)

## 페이지 전환
`useHomePageState`로 4개 뷰 전환: HOME ↔ HISTORY ↔ CHAT ↔ LEARNING
