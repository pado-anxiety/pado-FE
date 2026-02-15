# ACT Feature

## 구조
5개 ACT 하위 모듈 + 공통 컴포넌트:

```
act/
├── components/     # 공통 템플릿: ActIntroContent, ActStepLayout, ActResultContent
├── anchor/         # Contact with Present (5감 집중)
├── embrace/        # Acceptance (호흡 운동)
├── action/         # Committed Action (가치 평가)
├── detach/         # Cognitive Defusion (생각 분리)
├── diary/          # Emotion Note (감정 일기)
├── types.ts        # ActIntroData, ActResultData
└── constants.ts    # ACT_ANIMATION 타이밍
```

## 패턴

### useFunnel 기반 흐름
모든 모듈이 동일 패턴:
- `*Screen.tsx`: useFunnel 초기화, context 관리, analytics 추적
- `*StepContent.tsx`: step별 UI 렌더링
- `constants.ts`: STEPS 배열 (intro → step1-N → result)
- `types.ts`: StepId, Context, StepMeta 타입

### 공통 템플릿
- `ActIntroContent`: intro 화면 (제목 + 설명 + 단계 목록 + 시작 버튼)
- `ActStepLayout`: step 레이아웃 (헤더 네비 + 콘텐츠 + 액션 버튼)
- `ActResultContent`: result 화면 (제목 + 설명 + children + 완료 버튼)

### Analytics & Duration
- `useAnalytics()`: trackFunnelIntroNext, trackFunnelNext/Prev, trackFunnelExit, trackFunnelComplete
- `useDuration()`: getDuration(), resetDuration()

## 모듈별 특이사항
- **anchor**: ProgressCircle (react-native-svg) + CountButtons
- **embrace**: WaveCanvas + useBreathAnimation (호흡 애니메이션)
- **action**: ValueCircle (SVG 원형 차트), value-circle-utils.ts에 geometry 함수 분리
- **detach**: TokenSelector (단어 토큰 선택 인터랙션)
- **diary**: 3단계 텍스트 입력 (상황 → 생각 → 감정)
