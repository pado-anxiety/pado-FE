# Learning Feature

## 구조
```
learning/
├── components/
│   └── LearningCard.tsx    # 학습 카드 (제목 + 설명 + 이미지)
└── index.ts
```

## 역할
- `LearningCard`: 학습 콘텐츠 카드 컴포넌트
- Home feature의 `HomeListItem`에서 LEARNING 타입일 때 렌더링
- 학습 데이터는 `home/hooks/useHomeListData.ts`에 하드코딩 (anxietyImage, padoImage)
- 카드 클릭 시 `app/learning.tsx` 라우트로 WebView 렌더링
