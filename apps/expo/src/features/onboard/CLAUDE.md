# Onboard Feature

## 구조
```
onboard/
├── OnboardScreen.tsx           # useFunnel + useBreathing 조합
├── components/
│   ├── OnboardStepContent.tsx  # 텍스트 기반 단계 UI
│   └── OnboardBreathContent.tsx # 호흡 운동 UI
├── hooks/
│   └── useBreathing.ts         # 호흡 애니메이션 상태
├── constants.ts                # ONBOARD_STEPS, ANIMATION, BREATH 설정
├── types.ts                    # OnboardStepId, OnboardContext, StepContentData
└── index.ts
```

## 흐름
useFunnel로 텍스트 단계 → 호흡 운동 단계를 관리

### 호흡 운동
`useBreathing()` 훅:
- `isBreathing`, `breathText`, `breathTimer`: 호흡 상태
- `waveOffset`, `waveGapScale`: WaveHorizon에 전달하는 애니메이션 값

### 외부 의존
- `WaveHorizon`: home feature에서 import (파도 배경)
- `gapScale` SharedValue로 호흡에 맞춰 파도 간격 변화
