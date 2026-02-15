# Chat Feature

## 구조
AI 채팅 + CBT 추천 시스템:

```
chat/
├── ChatScreen.tsx              # Root: ChatModalProvider wrapper
├── ChatPageLayout.tsx          # 레이아웃 wrapper
├── context/
│   └── ChatModalContext.tsx    # 모달 상태 Context (isChatModalVisible, open/close)
├── components/
│   ├── ChatContainer/          # 메인 컨테이너 (채팅 목록 + 입력바)
│   │   ├── ChatContainer.tsx
│   │   ├── ChatList.tsx        # FlatList 메시지 렌더링
│   │   ├── ChatInputBar.tsx    # 텍스트 입력 + 전송 버튼
│   │   ├── CBTModal.tsx        # CBT 추천 3단계 모달
│   │   └── CBTRecommendationOverlay.tsx
│   ├── ChatItem/               # 메시지 버블 (User/Assistant/CBT)
│   └── ChatModalHeader.tsx
├── hooks/
│   ├── useChat.ts              # 메인 오케스트레이터 (3개 훅 조합)
│   ├── useChatMessages.ts      # 메시지 목록/전송/추천
│   ├── useChatInput.ts         # 입력 상태/ref/스크롤
│   ├── useChatKeyboard.ts      # 키보드 관련
│   ├── useChatQuota.ts         # 채팅 할당량
│   └── useCBTStep.ts           # CBT 단계/모달 로직
├── types/                      # Chat, ChatAPI, CBT 타입
├── utils/                      # parseChats, parseISO8601
└── constants/                  # ROLE, 타임아웃, 메시지 템플릿, mockData
```

## 패턴

### Hook 조합
`useChat`이 하위 3개 훅을 조합하여 통합 인터페이스 제공:
- `useChatMessages()`: 채팅 목록, 로딩, 전송, 추천
- `useChatInput()`: 입력 상태, ref, 스크롤
- `useChatKeyboard()`: 키보드 상태

### Context 기반 모달
`ChatModalContext`로 CBT 추천 오버레이 표시/숨김 관리

### CBT 추천 흐름
사용자 선택 → CBTModal (3단계: 증상 → 강도 → 트리거) → ACT 모듈 라우팅
