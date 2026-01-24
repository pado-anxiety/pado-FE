# 프로젝트 가이드라인 (CLAUDE.md)

## 모노레포 구조
Yarn Workspaces 기반 모노레포.

```
apps/
  expo/     # React Native (Expo) 모바일 앱
  web/      # Next.js 웹 앱
packages/
  bridge/   # 웹-앱 간 통신
  i18n/     # 다국어 설정
  locales/  # 번역 파일
  ui/       # 공유 UI 컴포넌트
  tailwind-design-tokens/    # 디자인 토큰
  tailwind-semantic-tokens/  # 시맨틱 토큰
```

## 주요 커맨드
```bash
yarn workspace pado-expo start:ios:development  # iOS 개발
yarn workspace pado-web dev                     # 웹 개발
```

## 기술 스택
- **프레임워크**: **Next.js 16** (웹) / Expo (모바일) + TypeScript
- **패키지 매니저**: Yarn 4 (Berry)

## 코딩 표준 및 리팩토링 규칙
- **컴포넌트**: 로직은 커스텀 훅으로 최대한 분리.
- **애니메이션**: 인터랙션 로직은 복잡해질 경우 별도 유틸리티나 훅으로 관리.
- **상태 관리**: 전역 상태보다 지역 상태와 Props 전달을 우선하며, 필요한 경우에만 Context API/Zustand 등 사용.
- **스타일**: Tailwind CSS 사용 (가급적 유틸리티 클래스 위주).

## 리팩토링 우선순위
1. 코드 중복 제거 및 공통 컴포넌트화.
2. 타입 안정성 확보 (any 사용 금지).
3. 복잡한 인터랙션 코드의 가독성 개선.
