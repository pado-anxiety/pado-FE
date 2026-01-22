# Jest 테스트 설정 트러블슈팅 로그

## 발생 일자
2025-01-22

## 1. 최초 문제 상황

### 증상
```bash
yarn test
```
실행 시 모든 테스트 스위트에서 다음 에러 발생:

```
TypeError: Cannot read properties of undefined (reading 'protocol')

at Object.setup (../../node_modules/expo/src/async-require/hmr.ts:89:40)
at Object.<anonymous> (../../node_modules/expo/src/async-require/setupHMR.ts:19:14)
at Object.<anonymous> (../../node_modules/expo/src/async-require/setup.ts:3:3)
at Object.<anonymous> (../../node_modules/expo/src/winter/runtime.ts:1:1)
at Object.<anonymous> (../../node_modules/expo/src/winter/index.ts:1:1)
at Object.<anonymous> (../../node_modules/jest-expo/src/preset/setup.js:305:1)
```

### 원인 분석

**근본 원인: `jest-expo` 프리셋의 HMR 초기화 순서 문제**

1. `jest-expo` 프리셋은 내부적으로 `expo/src/winter/index.ts`를 로드함
2. 이 모듈은 연쇄적으로 `expo/src/async-require/hmr.ts`를 import
3. `hmr.ts:89`에서 `location.protocol`에 접근하려고 시도
4. 하지만 Jest는 Node.js 환경에서 실행되므로 `location` 객체가 존재하지 않음
5. `setupFiles`에서 polyfill을 설정하더라도, 프리셋 로딩이 먼저 발생하여 polyfill이 적용되기 전에 에러 발생

```
실행 순서:
1. Jest 초기화
2. jest-expo 프리셋 로드 ← 여기서 hmr.ts가 로드되며 에러 발생
3. setupFiles 실행 (너무 늦음)
4. setupFilesAfterEnv 실행
5. 테스트 실행
```

### 해결 방법

`jest-expo` 프리셋 대신 `react-native` 프리셋 사용:

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',  // jest-expo 대신 사용
  // ...
};
```

`react-native` 프리셋은 Expo의 HMR 모듈을 로드하지 않으므로 `location.protocol` 에러가 발생하지 않음.

---

## 2. 두 번째 문제: 모듈 resolve 실패

### 증상
```
Cannot find module 'expo-secure-store' from 'jest-setup.js'
```

### 원인
`jest.mock()`은 기본적으로 실제 모듈이 `node_modules`에 존재해야 작동함. `jest-expo` 프리셋은 내부적으로 Expo 모듈들에 대한 resolve 경로를 설정해주지만, `react-native` 프리셋은 이를 하지 않음.

### 해결 방법
`moduleNameMapper`를 사용하여 모듈을 직접 모킹 파일로 매핑:

```javascript
// jest.config.js
moduleNameMapper: {
  '^expo-secure-store$': '<rootDir>/__mocks__/expo-secure-store.js',
  '^expo-router$': '<rootDir>/__mocks__/expo-router.js',
  // ...
}
```

`__mocks__/` 폴더에 각 모듈의 모킹 파일 생성.

---

## 3. 세 번째 문제: `app/login.test.tsx` 컴포넌트 테스트 실패

### 증상
```
TypeError: (0 , _timers.setTimeout) is not a function

at ../../node_modules/@testing-library/react-native/src/wait-for.ts:88:39
```

또는:
```
TypeError: globalObj.setTimeout is not a function

at setTimeout (../../node_modules/@testing-library/react-native/src/helpers/timers.ts:68:20)
```

### 원인 분석 (핵심)

**`@testing-library/react-native`의 타이머 처리 메커니즘**

1. **라이브러리의 타이머 의존성**

   `@testing-library/react-native`는 비동기 테스트를 위해 `waitFor`, `waitForElementToBeRemoved` 등의 유틸리티를 제공함. 이 함수들은 내부적으로 타이머를 사용:

   ```typescript
   // @testing-library/react-native/src/helpers/timers.ts
   export function setTimeout(fn: () => void, ms: number): number {
     return globalObj.setTimeout(fn, ms);  // ← 여기서 에러
   }
   ```

2. **`globalObj`의 정의**

   라이브러리는 전역 객체를 다음과 같이 가져옴:
   ```typescript
   const globalObj = typeof window !== 'undefined' ? window : global;
   ```

3. **문제 발생 지점**

   - `testEnvironment: 'node'`에서는 `window`가 undefined
   - 따라서 `globalObj = global`이 됨
   - `jest-shim.js`에서 `global.setTimeout`을 설정해도, 라이브러리가 로드되는 시점에 이미 참조가 캐시됨
   - 또한 Jest의 fake timers와 충돌 가능성 있음

4. **React Native 렌더링 환경 문제**

   `@testing-library/react-native`는 React Native 컴포넌트를 실제로 렌더링함:
   ```typescript
   import { render } from '@testing-library/react-native';
   render(<LoginScreen />);
   ```

   이 과정에서:
   - React Native의 `View`, `Text`, `Pressable` 등의 네이티브 컴포넌트가 필요
   - 애니메이션 라이브러리 (`react-native-reanimated`)가 초기화되어야 함
   - 네비게이션 컨텍스트 (`expo-router`)가 필요
   - StyleSheet, NativeWind 등의 스타일 시스템이 작동해야 함

5. **`waitFor`의 동작 방식**

   ```typescript
   // 간략화된 waitFor 로직
   async function waitFor(callback, options) {
     const timeout = options.timeout || 1000;
     const interval = options.interval || 50;

     return new Promise((resolve, reject) => {
       const timer = setTimeout(() => {  // ← globalObj.setTimeout 사용
         reject(new Error('Timed out'));
       }, timeout);

       const check = () => {
         try {
           const result = callback();
           clearTimeout(timer);
           resolve(result);
         } catch (error) {
           setTimeout(check, interval);  // ← 반복적으로 setTimeout 호출
         }
       };
       check();
     });
   }
   ```

   `waitFor`는 조건이 만족될 때까지 반복적으로 콜백을 실행하며, 이 과정에서 `setTimeout`을 사용. Node.js 환경에서 이 타이머가 제대로 작동하지 않으면 테스트가 hang되거나 에러 발생.

### 왜 단위 테스트는 되고 컴포넌트 테스트는 안 되는가?

| 구분 | 단위 테스트 (`src/lib/*.test.ts`) | 컴포넌트 테스트 (`app/login.test.tsx`) |
|------|-----------------------------------|---------------------------------------|
| 테스트 대상 | 순수 함수, API 클라이언트, 상태 로직 | React Native 컴포넌트 |
| React 사용 | 없거나 minimal | 전체 컴포넌트 트리 렌더링 |
| @testing-library 사용 | 미사용 | `render`, `fireEvent`, `waitFor` 사용 |
| 네이티브 모듈 의존성 | 거의 없음 (모킹으로 해결) | 많음 (View, Text, StyleSheet 등) |
| 비동기 처리 | `async/await`, Promise 직접 사용 | `waitFor` 내부 타이머 사용 |
| 환경 요구사항 | Node.js 충분 | React Native 렌더러 필요 |

---

## 4. 현재 상황

### 작동하는 것
- **4개 테스트 스위트, 76개 테스트 통과**
  - `src/lib/api/client.test.ts`
  - `src/lib/api/auth.test.ts`
  - `src/lib/auth/auth-context.test.ts`
  - `src/lib/auth/utils.test.ts`

### 작동하지 않는 것
- `app/login.test.tsx` (컴포넌트 테스트)
  - `@testing-library/react-native`의 타이머 문제
  - React Native 렌더링 환경 부재

### 현재 설정 파일 구조

```
apps/expo/
├── jest.config.js          # react-native 프리셋 사용, app/ 폴더 제외
├── jest-setup.js           # 최소한의 모킹
├── jest-shim.js            # 전역 객체 폴리필
├── __mocks__/              # 모듈 모킹 파일들
│   ├── expo-secure-store.js
│   ├── expo-router.js
│   ├── expo-constants.js
│   ├── expo-apple-authentication.js
│   ├── nativewind.js
│   ├── react-native-css-interop.js
│   ├── react-native-reanimated.js
│   ├── react-native-gesture-handler.js
│   └── react-native-mmkv.js
└── app/
    └── login.test.tsx      # 현재 제외됨 (testPathIgnorePatterns)
```

---

## 5. 컴포넌트 테스트를 위한 향후 해결 방안

### 옵션 1: jest-expo 프리셋 + 커스텀 설정

`jest-expo`를 다시 사용하되, HMR 모듈을 모킹:

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest-shim.js'],
  moduleNameMapper: {
    // Expo HMR 모듈 우회
    'expo/src/winter/index': '<rootDir>/__mocks__/expo-winter.js',
  },
};
```

### 옵션 2: 별도의 컴포넌트 테스트 설정

`jest.config.component.js` 파일을 만들어 컴포넌트 테스트 전용 설정:

```javascript
// jest.config.component.js
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/app/**/*.test.tsx'],
  testEnvironment: 'jsdom',  // 또는 jest-expo의 기본 환경
  // ...
};
```

```bash
yarn test:unit      # 단위 테스트
yarn test:component # 컴포넌트 테스트
```

### 옵션 3: React Native Testing Library의 Pure JS 환경 사용

최신 버전의 `@testing-library/react-native`는 `jest-native`와 함께 순수 JS 환경에서도 작동하도록 개선됨. 하지만 NativeWind, Reanimated 등의 네이티브 의존성이 있는 경우 추가 설정 필요.

### 옵션 4: E2E 테스트로 전환

컴포넌트 테스트 대신 Detox나 Maestro를 사용한 E2E 테스트로 UI 테스트 수행:

```bash
# Detox 사용 예
detox test --configuration ios.sim.debug
```

---

## 6. 최종 해결: jest-expo + HMR 모킹

### 해결 방법

`jest-expo` 프리셋을 사용하면서 `moduleNameMapper`로 HMR 모듈을 모킹:

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    // Expo HMR/Winter 모듈 모킹 (location.protocol 에러 방지)
    '^expo/src/winter(.*)$': '<rootDir>/__mocks__/expo-winter.js',
    // ... 기타 모킹
  },
};
```

```javascript
// __mocks__/expo-winter.js
module.exports = {};
```

### 왜 이 방법이 작동하는가?

1. `moduleNameMapper`는 모듈 resolve 단계에서 작동
2. Jest가 `expo/src/winter/index.ts`를 import하려 할 때, resolve 전에 매핑이 적용됨
3. 실제 HMR 모듈 대신 빈 모킹 파일이 로드되어 `location.protocol` 접근이 발생하지 않음

---

## 7. 결론

| 테스트 유형 | 현재 상태 | 비고 |
|-------------|-----------|------|
| 단위 테스트 (순수 로직) | ✅ 작동 | 4개 스위트, 76개 테스트 통과 |
| 컴포넌트 테스트 | ⚠️ 별도 설정 필요 | `app/` 폴더는 현재 제외 |

### 현재 설정 파일 구조

```
apps/expo/
├── jest.config.js          # jest-expo 프리셋 + HMR 모킹
├── jest-setup.js           # 추가 모킹 설정
├── jest-shim.js            # 전역 객체 폴리필
└── __mocks__/
    ├── expo-winter.js      # HMR 모듈 모킹 (핵심!)
    ├── expo-secure-store.js
    ├── expo-router.js
    ├── expo-constants.js
    ├── expo-apple-authentication.js
    ├── nativewind.js
    ├── react-native-css-interop.js
    ├── react-native-reanimated.js
    ├── react-native-gesture-handler.js
    └── react-native-mmkv.js
```

단위 테스트만으로도 비즈니스 로직, API 클라이언트, 인증 로직 등 핵심 기능의 테스트가 가능함. 컴포넌트 테스트(`app/login.test.tsx`)는 `@testing-library/react-native`의 타이머 문제로 추가 설정이 필요하며, 복잡한 UI 인터랙션은 E2E 테스트(Detox, Maestro)가 더 효과적일 수 있음.
