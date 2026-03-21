# iOS 릴리즈 워크플로우

## 개요

릴리즈 문서 작성 → 빌드 → App Store 제출까지의 전체 흐름.
Claude Code 스킬로 자동화되어 있으며, 모듈별 독립 실행 또는 파이프라인 실행이 가능하다.

## 스킬 구조

```
/ios-build                    빌드 (모듈)
/ios-submit {buildId}         App Store 제출 (모듈)
/ios-release                  빌드 + 제출 파이프라인
```

### /ios-build

| 파라미터 | 설명 |
|----------|------|
| (기본) | production 빌드. 릴리즈 문서 확인 + 버전 동기화 포함 |
| `--development` | development 프로파일 빌드 |
| `--preview` | preview 프로파일 빌드 |
| `--production` | production 빌드 (기본값과 동일) |

### /ios-submit

| 파라미터 | 설명 |
|----------|------|
| `{buildId}` | EAS 빌드 ID (필수) |
| `--testflight` | 심사 제출 없이 TestFlight 배포만 |

### /ios-release

| 파라미터 | 설명 |
|----------|------|
| `--testflight` | TestFlight 배포만 |

## 릴리즈 흐름

### 1. 릴리즈 문서 작성 (수동)

```yaml
# docs/release/v2.4.0.yml
ko:
  whatsNew: |
    - 새로운 기능 설명
en:
  whatsNew: |
    - New feature description
```

- 파일명의 버전이 source of truth
- `ko.whatsNew`, `en.whatsNew` 필수

### 2. 빌드 + 제출

```
# 한번에
/ios-release

# 또는 모듈별
/ios-build
/ios-submit {buildId}
```

### 3. Submit 내부 동작

1. `eas submit` → App Store Connect에 빌드 업로드
2. ASC 빌드 처리 대기 (2~5분)
3. 새 버전 페이지 생성 (ASC API)
4. 빌드 연결
5. 릴리즈 노트 채우기 (릴리즈 문서에서)
6. 필수값 검증 → 빈 값은 이전 버전에서 복제, 불가하면 중단
7. 심사 제출

## 버전 관리 규칙

- **릴리즈 문서가 버전의 source of truth**
- `package.json` 버전은 빌드 시 릴리즈 문서에 맞춰 자동 동기화
- 릴리즈 문서 버전 == `package.json` 버전 → EAS 빌드 이력으로 자동 판단:
  - 해당 버전 빌드 이력 있음 → 재빌드 상황 → 사용자에게 확인
  - 해당 버전 빌드 이력 없음 → 릴리즈 문서 미작성으로 간주 → 중단

## Prerequisites

### ASC API 인증

`apps/expo/.asc.env` 파일에 인증 정보를 설정 (gitignore 됨):

```
ASC_KEY_ID=API Key ID
ASC_ISSUER_ID=Issuer ID
ASC_PRIVATE_KEY_PATH=.p8 키 파일 경로
ASC_APP_ID=Apple 숫자 App ID
```

발급: App Store Connect → Users and Access → Integrations → App Store Connect API
App ID 확인: App Store Connect → 앱 선택 → General → App Information → Apple ID

### app.config.ts 설정

`ios.infoPlist`에 `ITSAppUsesNonExemptEncryption: false` 설정 완료.
매 업로드 시 암호화 수동 체크를 자동으로 건너뜀.

## TestFlight 배포

TestFlight은 production 빌드와 동일한 바이너리 사용.
빌드를 ASC에 업로드하면 자동으로 TestFlight에 노출됨.

```
# TestFlight만
/ios-build
eas submit --platform ios --id {buildId} --non-interactive

# 또는 파이프라인으로
/ios-release --testflight
```

## 에러 대응

| 상황 | 대응 |
|------|------|
| 릴리즈 문서 없음 | `docs/release/v{version}.yml` 작성 |
| 버전 동일 (재빌드 확인) | EAS 빌드 이력 자동 판단 → 사용자 확인 또는 새 릴리즈 문서 작성 |
| ASC 빌드 처리 지연 | 자동 폴링, 5분 초과 시 알림 |
| 스크린샷 없음 | ASC에서 직접 추가 |
| 필수값 복제 불가 | ASC에서 직접 입력 |
| Submit 중간 실패 | 빌드 ID로 `/ios-submit {buildId}` 재시도 |
