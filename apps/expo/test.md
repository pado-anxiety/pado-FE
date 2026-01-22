# Nyangtodac Expo App 테스트 리스트

이 문서는 Nyangtodac Expo 앱의 핵심 기능에 대한 테스트 케이스 목록입니다.

## 1. 인증 (Authentication)

> 테스트 파일 위치:
> - `app/login.test.tsx` - 로그인 화면 UI 테스트
> - `src/lib/auth/utils.test.ts` - authStorage 테스트
> - `src/lib/auth/auth-context.test.ts` - useAuth 스토어 테스트
> - `src/lib/api/auth.test.ts` - authAPI 테스트
> - `src/lib/api/client.test.ts` - apiClient interceptor 테스트

### 1.1 로그인 화면 (`app/login.test.tsx`)

- **렌더링**
  - [x] 로그인 화면이 올바르게 렌더링되는지 확인 (앱 이름, 태그라인, 설명)
  - [x] Apple 로그인 버튼이 표시되는지 확인
  - [x] Google 로그인 버튼이 표시되는지 확인
  - [x] 카카오 로그인 버튼이 표시되는지 확인
  - [x] 이용약관 동의 텍스트가 표시되는지 확인

- **Apple 로그인**
  - [x] Apple 로그인 버튼 클릭 시 `login('apple')` 호출
  - [x] Apple 로그인 실패 시 에러 알림 표시
  - [x] Apple 로그인 실패 시 홈 화면으로 이동하지 않음

- **Google 로그인**
  - [x] Google 로그인 버튼 클릭 시 `login('google')` 호출
  - [x] Google 로그인 성공 시 홈 화면으로 이동
  - [x] Google 로그인 실패 시 에러 알림 표시
  - [x] Google 로그인 실패 시 홈 화면으로 이동하지 않음

- **카카오 로그인**
  - [x] 카카오 로그인 버튼 클릭 시 `login('kakao')` 호출
  - [x] 카카오 로그인 성공 시 홈 화면으로 이동
  - [x] 카카오 로그인 실패 시 에러 알림 표시
  - [x] 카카오 로그인 실패 시 홈 화면으로 이동하지 않음

### 1.2 authStorage (`src/lib/auth/utils.test.ts`)

- **토큰 조회**
  - [x] `getAccessToken()`: storage에 accessToken이 있으면 반환
  - [x] `getAccessToken()`: storage에 accessToken이 없으면 null 반환
  - [x] `getRefreshToken()`: storage에 refreshToken이 있으면 반환
  - [x] `getRefreshToken()`: storage에 refreshToken이 없으면 null 반환

- **사용자 정보 조회**
  - [x] `getName()`: storage에 userName이 있으면 반환
  - [x] `getName()`: storage에 userName이 없으면 null 반환
  - [x] `getEmail()`: storage에 userEmail이 있으면 반환
  - [x] `getEmail()`: storage에 userEmail이 없으면 null 반환

- **토큰 저장**
  - [x] `setAuthToken()`: accessToken과 refreshToken을 storage에 저장
  - [x] `setAuthToken()`: 빈 문자열은 저장하지 않음

- **사용자 정보 저장**
  - [x] `setUserInfo()`: name과 email을 storage에 저장
  - [x] `setUserInfo()`: 빈 문자열은 저장하지 않음

- **인증 정보 삭제**
  - [x] `clearAuthInfo()`: accessToken, refreshToken, userName, userEmail 모두 삭제

- **유틸리티**
  - [x] `parseAuthToken()`: 토큰 객체에서 accessToken과 refreshToken 추출

### 1.3 authAPI (`src/lib/api/auth.test.ts`)

- **토큰 재발급 (reissueAuthToken)**
  - [x] 정상적인 refreshToken으로 요청 시 새로운 accessToken, refreshToken 반환
  - [x] `/tokens/reissue` 엔드포인트로 POST 요청 전송
  - [x] 유효하지 않은 refreshToken으로 요청 시 에러 발생

- **Google 토큰 교환 (getGoogleAccessToken)**
  - [x] iOS 플랫폼에서 올바른 파라미터로 토큰 요청
  - [x] Android 플랫폼에서 올바른 파라미터로 토큰 요청
  - [x] `/login/google` 엔드포인트로 POST 요청 전송

- **Kakao 토큰 교환 (getKaKaoAccessToken)**
  - [x] 유효한 accessToken으로 요청 시 토큰 반환
  - [x] `/login/kakao` 엔드포인트로 POST 요청 전송

- **로그아웃 (logout)**
  - [x] accessToken이 있으면 Authorization 헤더와 함께 `/logout`으로 POST 요청
  - [x] accessToken이 null이면 API를 호출하지 않음
  - [x] accessToken이 빈 문자열이면 API를 호출하지 않음

### 1.4 useAuth 스토어 (`src/lib/auth/auth-context.test.ts`)

- **초기 상태**
  - [x] authStorage에서 초기 값 로드
  - [x] accessToken이 있으면 isLoggedIn이 true
  - [x] accessToken이 없으면 isLoggedIn이 false

- **login 함수**
  - [x] platform='google'이면 SignInWithGoogle 호출
  - [x] platform='kakao'이면 SignInWithKakao 호출
  - [x] platform='apple'이면 SignInWithApple 호출
  - [x] 로그인 시작 시 isLoading이 true로 설정
  - [x] 소셜 로그인 성공 후 토큰이 state와 storage에 저장
  - [x] 소셜 로그인 성공 후 userAPI.getUser() 호출
  - [x] userAPI.getUser() 성공 시 name, email이 state와 storage에 저장
  - [x] userAPI.getUser() 성공 시 isLoggedIn이 true로 설정
  - [x] 소셜 로그인 실패 시 errorMessage 반환
  - [x] 토큰을 받지 못하면 'auth.error.tokenFailed' 에러 메시지 반환
  - [x] userAPI.getUser() 실패 시 'auth.error.unexpected' 에러 메시지 반환
  - [x] 로그인 완료/실패 후 isLoading이 false로 설정

- **logout 함수**
  - [x] 로그아웃 시작 시 현재 accessToken 저장
  - [x] authStorage.clearAuthInfo() 호출하여 로컬 storage 정리
  - [x] state 초기화 (name, email, accessToken, refreshToken = null, isLoggedIn = false)
  - [x] authAPI.logout()이 저장된 accessToken으로 호출
  - [x] authAPI.logout() 실패해도 에러를 무시하고 로그아웃 완료
  - [x] 로그아웃 후 router.replace(ROUTES.HOME)으로 이동

- **clearAuth 함수**
  - [x] authStorage.clearAuthInfo() 호출
  - [x] state 초기화 (API 호출 없이 로컬만 정리)
  - [x] logout과 달리 router 이동 없음
  - [x] logout과 달리 API 호출 없음

- **setAuthToken 함수**
  - [x] authStorage.setAuthToken() 호출
  - [x] state에 accessToken, refreshToken 설정
  - [x] isLoggedIn이 true로 설정
  - [x] isLoading이 false로 설정

- **setUserInfo 함수**
  - [x] authStorage.setUserInfo() 호출
  - [x] state에 name, email 설정

### 1.5 apiClient Interceptor (`src/lib/api/client.test.ts`)

- **Request Interceptor**
  - [x] accessToken이 있으면 Authorization 헤더에 `Bearer {token}` 형식으로 설정
  - [x] accessToken이 없으면 Authorization 헤더를 설정하지 않음

- **Response Interceptor - 성공**
  - [x] 정상 응답 시 response.data 반환

- **Response Interceptor - 401 에러 처리**
  - [x] 401 에러 발생 시 authAPI.reissueAuthToken() 호출
  - [x] 토큰 재발급 성공 시 useAuth.setAuthToken()으로 새 토큰 저장
  - [x] 토큰 재발급 성공 시 원래 요청을 새 토큰으로 재시도
  - [x] 이미 retry한 요청(_retry=true)은 재발급 시도하지 않고 에러 반환
  - [x] refreshToken이 없는 상태에서는 재발급 시도하지 않음

- **Response Interceptor - 재발급 실패**
  - [x] 토큰 재발급 실패 시 useAuth.clearAuth() 호출
  - [x] showAlert.warning()으로 로그인 필요 알림 표시
  - [x] 알림 확인 시 router.replace(ROUTES.LOGIN)으로 이동

- **401 이외의 에러**
  - [x] 401이 아닌 에러(400, 403, 404, 500)는 그대로 reject

### 1.6 통합 시나리오 테스트

- **토큰 재발급 플로우**
  - [x] API 요청 → 401 에러 → 토큰 재발급 → 원래 요청 재시도 전체 플로우
  - [x] 재발급된 토큰으로 state와 storage 모두 업데이트

- **세션 만료 플로우**
  - [x] API 요청 → 401 에러 → 토큰 재발급 실패 → clearAuth → 알림

## 2. 온보딩 (Onboarding)

- [ ] 신규 사용자에게 온보딩 화면이 표시되는지 확인합니다.
- [ ] 온보딩 플로우를 순서대로 진행하고 완료할 수 있는지 확인합니다.
- [ ] 온보딩 완료 후 홈 화면으로 이동하는지 확인합니다.

## 3. 홈 화면 (Home)

- [ ] 홈 화면의 주요 UI 요소 가 올바르게 렌더링되는지 확인합니다.
- [ ] 각 ACT 활동 및 기록, 학습 탭 메뉴로 이동이 가능한지 확인합니다.
- [ ] storage 에 onboard_status 가 없을 시 홈 화면에서 온보딩으로 이동하는지 확인
- [ ] useAuth 로그인이 되어 있지 않을 시 로그인 화면으로 이동

## 4. ACT (수용전념치료) 활동

- **공통**
    - [ ] 각 활동의 시작 화면으로 정상적으로 이동하는지 확인합니다.
    - [ ] 각 활동의 단계별(step) 진행이 가능한지 확인합니다.
    - [ ] 각 활동 완료 후 결과 화면이 올바르게 표시되는지 확인합니다.
    - [ ] 각 스텝 별 웹뷰 메시지 핸들링이 정상적으로 이루어지는지 확인합니다.
    - [ ] 각 컨텐츠 별 result 화면에서 이전스텝의 데이터가 정상적으로 받아지는지 확인
- **개별 활동 테스트**
    - [ ] 현재 접촉하기(anchor): 스텝별 UI 및 상호작용 테스트
    - [ ] 일기 쓰기(diary): 스텝별 UI 및 상호작용 테스트, 현재 스탭에서 이전 스텝의 제목과 내용이 보이는지 체크
    - [ ] 생각과 사실 분리하기(detach): 텍스트 입력 및 저장 기능 테스트, 드래그 이벤트
    - [ ] 수용하기(embrace): 호흡 애니메이션 진행 여부, 다시하기, 호흡 시간 계산
    - [ ] 행동하기: 불스아이 터치 가능 여부, 불스아이 각 영역 별 텍스트 표시 여부

## 5. 기록 (History)

- [ ] 지난 활동 기록이 목록 형태로 올바르게 표시되는지 확인합니다.
- [ ] ACT 별, 각 기록 항목을 선택했을 때 상세 내용이 표시되는지 확인합니다.
- [ ] 무한 스크롤이 정상적으로 동작하는지 확인

## 6. 학습 (Learning)

- [ ] 학습 콘텐츠 목록이 올바르게 표시되는지 확인합니다.
- [ ] 각 콘텐츠를 선택했을 때 상세 내용 (텍스트, 이미지)이 올바르게 표시되는지 확인합니다.

## 7. 설정 (Settings)

- [ ] 설정 화면으로 정상적으로 이동하는지 확인합니다.
- [ ] 언어 변경 기능이 동작하고 앱 전체에 반영되는지 확인합니다. (i18n)
- [ ] 진동 설정 토글이 정상적으로 동작하는지 확인합니다.
- [ ] 이용약관, 개인정보처리방침, 라이선스 페이지로 이동이 가능한지 확인합니다.

## 8. 핵심 UI 컴포넌트 (Unit Tests)

- [ ] `Button`: 클릭 이벤트, 비활성화 상태 테스트
- [ ] `Input`: 텍스트 입력, 유효성 검사 상태 테스트
- [ ] `Modal`: 열고 닫기 기능, 내부 컨텐츠 렌더링 테스트
- [ ] `AnimatedText`: 텍스트 애니메이션 효과 테스트
- [ ] `PageSafeAreaView`: 화면 별 안전 영역이 올바르게 적용되는지 확인

## 9. API 연동

- [ ] `src/lib/api`의 각 API 클라이언트 함수에 대한 단위 테스트 (Mocking 사용)
- [ ] 로그인/회원가입 API 연동 및 예외 처리 (성공, 실패) 테스트
- [ ] ACT 활동 결과 전송 API 연동 및 예외 처리 테스트
- [ ] 기록 조회 API 연동 및 예외 처리 테스트

## 10. 로그인 (Authentication Logic)

### 10.1 authStorage (src/lib/auth/utils.ts)

- **토큰 저장/조회**
  - [ ] `getAccessToken()`: storage에 accessToken이 있으면 반환, 없으면 null 반환
  - [ ] `getRefreshToken()`: storage에 refreshToken이 있으면 반환, 없으면 null 반환
  - [ ] `setAuthToken()`: accessToken과 refreshToken이 storage에 올바르게 저장되는지 확인
  - [ ] `setAuthToken()`: 빈 문자열이나 null 값은 저장하지 않는지 확인

- **사용자 정보 저장/조회**
  - [ ] `getName()`: storage에 userName이 있으면 반환, 없으면 null 반환
  - [ ] `getEmail()`: storage에 userEmail이 있으면 반환, 없으면 null 반환
  - [ ] `setUserInfo()`: name과 email이 storage에 올바르게 저장되는지 확인

- **인증 정보 삭제**
  - [ ] `clearAuthInfo()`: accessToken, refreshToken, userName, userEmail 모두 삭제되는지 확인

### 10.2 authAPI (src/lib/api/auth.ts)

- **토큰 재발급 (reissueAuthToken)**
  - [ ] 정상적인 refreshToken으로 요청 시 새로운 accessToken, refreshToken 반환
  - [ ] 유효하지 않은 refreshToken으로 요청 시 에러 발생 (mocking)
  - [ ] 올바른 엔드포인트(`/tokens/reissue`)로 POST 요청이 전송되는지 확인

- **Google 토큰 교환 (getGoogleAccessToken)**
  - [ ] iOS: codeVerifier, authorizationCode, redirectUri, platform='IOS'로 요청 시 토큰 반환 (mocking)
  - [ ] Android: platform='ANDROID'로 요청 시 토큰 반환 (mocking)
  - [ ] 올바른 엔드포인트(`/login/google`)로 POST 요청이 전송되는지 확인

- **Kakao 토큰 교환 (getKaKaoAccessToken)**
  - [ ] 유효한 accessToken으로 요청 시 토큰 반환 (mocking)
  - [ ] 올바른 엔드포인트(`/login/kakao`)로 POST 요청이 전송되는지 확인

- **로그아웃 (logout)**
  - [ ] accessToken이 있으면 Authorization 헤더와 함께 `/logout` 엔드포인트로 POST 요청
  - [ ] accessToken이 null이면 API 호출하지 않음

### 10.3 useAuth 스토어 (src/lib/auth/auth-context.tsx)

- **초기 상태**
  - [ ] 앱 시작 시 authStorage에서 accessToken, refreshToken, name, email을 로드
  - [ ] accessToken이 있으면 isLoggedIn이 true, 없으면 false

- **login 함수**
  - [ ] platform='google' 시 SignInWithGoogle 호출
  - [ ] platform='kakao' 시 SignInWithKakao 호출
  - [ ] platform='apple' 시 SignInWithApple 호출
  - [ ] 로그인 시작 시 isLoading이 true로 설정
  - [ ] 소셜 로그인 성공 후 토큰이 state와 storage에 저장되는지 확인
  - [ ] 소셜 로그인 성공 후 userAPI.getUser()가 호출되는지 확인
  - [ ] userAPI.getUser() 성공 시 name, email이 state와 storage에 저장되는지 확인
  - [ ] userAPI.getUser() 성공 시 isLoggedIn이 true로 설정
  - [ ] 소셜 로그인 실패 시 errorMessage 반환
  - [ ] 소셜 로그인에서 토큰을 받지 못하면 'auth.error.tokenFailed' 에러 메시지 반환
  - [ ] userAPI.getUser() 실패 시 'auth.error.unexpected' 에러 메시지 반환
  - [ ] 로그인 완료/실패 후 isLoading이 false로 설정 (finally)

- **logout 함수**
  - [ ] 로그아웃 시작 시 현재 accessToken 저장
  - [ ] isLoading이 true로 설정
  - [ ] authStorage.clearAuthInfo()가 호출되어 로컬 storage 정리
  - [ ] state가 초기화 (name, email, accessToken, refreshToken = null, isLoggedIn = false)
  - [ ] authAPI.logout()이 저장된 accessToken으로 호출 (interceptor 우회)
  - [ ] authAPI.logout() 실패해도 에러를 무시하고 로그아웃 완료
  - [ ] 로그아웃 후 router.replace(ROUTES.HOME)으로 이동

- **clearAuth 함수**
  - [ ] authStorage.clearAuthInfo() 호출
  - [ ] state 초기화 (API 호출 없이 로컬만 정리)
  - [ ] logout과 달리 router 이동 없음

- **setAuthToken 함수**
  - [ ] authStorage.setAuthToken() 호출
  - [ ] state에 accessToken, refreshToken 설정
  - [ ] isLoggedIn이 true로 설정

- **setUserInfo 함수**
  - [ ] authStorage.setUserInfo() 호출
  - [ ] state에 name, email 설정

### 10.4 apiClient Interceptor (src/lib/api/client.ts)

- **Request Interceptor**
  - [ ] accessToken이 있으면 Authorization 헤더에 `Bearer {token}` 형식으로 설정
  - [ ] accessToken이 없으면 Authorization 헤더 없이 요청

- **Response Interceptor - 성공**
  - [ ] 정상 응답 시 response.data 반환

- **Response Interceptor - 401 에러 처리**
  - [ ] 401 에러 발생 시 authAPI.reissueAuthToken() 호출
  - [ ] 토큰 재발급 성공 시 useAuth.setAuthToken()으로 새 토큰 저장
  - [ ] 토큰 재발급 성공 시 원래 요청을 새 토큰으로 재시도
  - [ ] 이미 retry한 요청(_retry=true)은 재발급 시도하지 않고 에러 반환
  - [ ] refreshToken이 없는 상태(로그아웃 상태)에서는 재발급 시도하지 않음

- **Response Interceptor - 재발급 실패**
  - [ ] 토큰 재발급 실패 시 useAuth.clearAuth() 호출
  - [ ] showAlert.warning()으로 로그인 필요 알림 표시
  - [ ] 알림 확인 시 router.replace(ROUTES.LOGIN)으로 이동

- **401 이외의 에러**
  - [ ] 401이 아닌 에러는 그대로 reject

### 10.5 소셜 로그인 함수

- **SignInWithGoogle (src/lib/auth/google-login.ts)**
  - [ ] iOS에서는 SignInWithGoogleOnIOS 호출
  - [ ] Android에서는 SignInWithGoogleOnAndroid 호출
  - [ ] iOS: PKCE flow로 codeVerifier, codeChallenge 생성
  - [ ] iOS: WebBrowser.openAuthSessionAsync로 Google 인증 페이지 오픈
  - [ ] iOS: 인증 성공 시 authorizationCode 추출하여 authAPI.getGoogleAccessToken 호출
  - [ ] iOS: 인증 취소 시 'auth.error.googleAuthCanceled' 에러 반환
  - [ ] iOS: authorizationCode 없으면 'auth.error.googleAuthCodeFailed' 에러 반환
  - [ ] Android: GoogleSignin.signIn()으로 serverAuthCode 획득
  - [ ] Android: serverAuthCode로 authAPI.getGoogleAccessToken 호출
  - [ ] Android: userInfo 없거나 serverAuthCode 없으면 'auth.error.googleAuthInfoFailed' 에러 반환
  - [ ] 예외 발생 시 'auth.error.googleError' 에러 반환

- **SignInWithKakao (src/lib/auth/kakao-login.ts)**
  - [ ] @react-native-seoul/kakao-login의 login() 호출
  - [ ] login() 성공 시 accessToken으로 authAPI.getKaKaoAccessToken 호출
  - [ ] 토큰 교환 성공 시 accessToken, refreshToken 반환
  - [ ] login() 실패 또는 토큰 없으면 'auth.error.kakaoFailed' 에러 반환
  - [ ] 예외 발생 시 'auth.error.kakaoError' 에러 반환

- **SignInWithApple (src/lib/auth/apple-login.ts)**
  - [ ] AppleAuthentication.signInAsync() 호출
  - [ ] requestedScopes에 FULL_NAME, EMAIL 포함
  - [ ] credential에서 identityToken, authorizationCode, fullName, email 추출
  - [ ] (TODO: 백엔드 연동 구현 후) 토큰 교환 및 반환 테스트
  - [ ] 예외 발생 시 'common.error.generic' 에러 반환

### 10.6 PKCE 유틸리티 (src/lib/auth/pkce.ts)

- [ ] `generateCodeVerifier()`: 32바이트 랜덤 값을 base64url 인코딩하여 반환
- [ ] `generateCodeChallenge()`: codeVerifier를 SHA256 해시 후 base64url 인코딩
- [ ] `getGoogleClientId()`: iOS에서 ENV.IOS_GOOGLE_CLIENT_ID 반환

### 10.7 통합 시나리오 테스트

- **로그인 전체 플로우**
  - [ ] 소셜 로그인 → 토큰 저장 → 사용자 정보 조회 → 상태 업데이트 전체 플로우 확인
  - [ ] 로그인 중 isLoading 상태 변화 확인 (false → true → false)

- **토큰 재발급 플로우**
  - [ ] API 요청 → 401 에러 → 토큰 재발급 → 원래 요청 재시도 전체 플로우 확인
  - [ ] 재발급된 토큰으로 state와 storage 모두 업데이트되는지 확인

- **세션 만료 플로우**
  - [ ] API 요청 → 401 에러 → 토큰 재발급 실패 → clearAuth → 로그인 화면 이동 확인
  - [ ] 알림이 올바르게 표시되는지 확인

- **로그아웃 전체 플로우**
  - [ ] 로그아웃 버튼 클릭 → 로컬 정리 → API 호출 → 홈 화면 이동 확인
  - [ ] API 실패해도 로그아웃 완료되는지 확인
