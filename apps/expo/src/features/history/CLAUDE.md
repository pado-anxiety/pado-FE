# History Feature

## 구조
```
history/
├── components/
│   ├── HistoryModal/
│   │   ├── HistoryModalContent.tsx   # data.type 기반 switch 렌더러
│   │   ├── contents/                 # ACT 타입별 상세 뷰 (6개)
│   │   └── layouts/                  # ModalHeader, ModalScrollContainer, ContentBox
│   ├── HistoryCard.tsx               # 목록 카드 (날짜 + 제목 + 아이콘)
│   └── HistorySkySection.tsx         # 기록 페이지 헤더
├── types/
│   ├── history.ts                    # HistoryItem
│   └── act-type.ts                   # ACTType union + ActHistory (discriminated union)
└── index.ts
```

## 패턴

### 타입 기반 콘텐츠 렌더링
`HistoryModalContent`가 `data.type`으로 분기:
- CONTACT_WITH_PRESENT → ContactWithPresentContent
- EMOTION_NOTE → EmotionNoteContent
- COGNITIVE_DEFUSION → CognitiveDefusionContent
- ACCEPTANCE → AcceptanceContent
- VALUES → ValuesContent
- COMMITTED_ACTION → CommittedActionContent

### 레이아웃 빌딩 블록
모든 contents가 동일 구조: `ModalScrollContainer` > `ModalHeader` + `ContentBox`들

### 데이터
- `ActHistory`: discriminated union (`type` 필드 + 모듈별 `data`)
- `ACTType`: 6개 모듈 타입 유니온
- `HistoryItem`: { id, type } — 목록용 간략 정보
