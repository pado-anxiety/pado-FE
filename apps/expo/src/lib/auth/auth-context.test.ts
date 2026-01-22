// Import after mocks
import { router } from 'expo-router';

import { authAPI } from '../api/auth';
import { userAPI } from '../api/user';
import { SignInWithApple } from './apple-login';
import { useAuth } from './auth-context';
import { SignInWithGoogle } from './google-login';
import { SignInWithKakao } from './kakao-login';
import { authStorage } from './utils';

// All mocks must be defined inside jest.mock factory to avoid hoisting issues

jest.mock('./utils', () => ({
  authStorage: {
    getName: jest.fn().mockReturnValue(null),
    getEmail: jest.fn().mockReturnValue(null),
    getAccessToken: jest.fn().mockReturnValue(null),
    getRefreshToken: jest.fn().mockReturnValue(null),
    setAuthToken: jest.fn(),
    setUserInfo: jest.fn(),
    clearAuthInfo: jest.fn(),
  },
}));

jest.mock('./google-login', () => ({
  SignInWithGoogle: jest.fn(),
}));

jest.mock('./kakao-login', () => ({
  SignInWithKakao: jest.fn(),
}));

jest.mock('./apple-login', () => ({
  SignInWithApple: jest.fn(),
}));

jest.mock('../api/auth', () => ({
  authAPI: {
    logout: jest.fn(),
  },
}));

jest.mock('../api/user', () => ({
  userAPI: {
    getUser: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock('../i18n', () => ({
  i18n: {
    t: (key: string) => key,
  },
}));

jest.mock('../route', () => ({
  ROUTES: {
    HOME: '/home',
    LOGIN: '/login',
  },
}));

// Get mock references
const mockAuthStorage = authStorage as jest.Mocked<typeof authStorage>;
const mockSignInWithGoogle = SignInWithGoogle as jest.Mock;
const mockSignInWithKakao = SignInWithKakao as jest.Mock;
const mockSignInWithApple = SignInWithApple as jest.Mock;
const mockAuthAPILogout = authAPI.logout as jest.Mock;
const mockUserAPIGetUser = userAPI.getUser as jest.Mock;
const mockRouterReplace = router.replace as jest.Mock;

describe('useAuth store', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset store state
    useAuth.setState({
      name: null,
      email: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      isLoading: false,
    });
  });

  describe('초기 상태', () => {
    it('accessToken이 있으면 isLoggedIn이 true이다', () => {
      useAuth.setState({
        accessToken: 'test-token',
        isLoggedIn: true,
      });

      const state = useAuth.getState();
      expect(state.isLoggedIn).toBe(true);
    });

    it('accessToken이 없으면 isLoggedIn이 false이다', () => {
      useAuth.setState({
        accessToken: null,
        isLoggedIn: false,
      });

      const state = useAuth.getState();
      expect(state.isLoggedIn).toBe(false);
    });
  });

  describe('login 함수', () => {
    it('platform이 google이면 SignInWithGoogle을 호출한다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        accessToken: 'google-access',
        refreshToken: 'google-refresh',
      });
      mockUserAPIGetUser.mockResolvedValue({
        name: '구글유저',
        email: 'google@test.com',
      });

      await useAuth.getState().login('google');

      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });

    it('platform이 kakao이면 SignInWithKakao를 호출한다', async () => {
      mockSignInWithKakao.mockResolvedValue({
        accessToken: 'kakao-access',
        refreshToken: 'kakao-refresh',
      });
      mockUserAPIGetUser.mockResolvedValue({
        name: '카카오유저',
        email: 'kakao@test.com',
      });

      await useAuth.getState().login('kakao');

      expect(mockSignInWithKakao).toHaveBeenCalled();
    });

    it('platform이 apple이면 SignInWithApple을 호출한다', async () => {
      mockSignInWithApple.mockResolvedValue({});

      await useAuth.getState().login('apple');

      expect(mockSignInWithApple).toHaveBeenCalled();
    });

    it('로그인 시작 시 isLoading이 true로 설정된다', async () => {
      let loadingDuringLogin = false;
      mockSignInWithGoogle.mockImplementation(() => {
        loadingDuringLogin = useAuth.getState().isLoading;
        return Promise.resolve({
          accessToken: 'token',
          refreshToken: 'token',
        });
      });
      mockUserAPIGetUser.mockResolvedValue({ name: 'test', email: 'test' });

      await useAuth.getState().login('google');

      expect(loadingDuringLogin).toBe(true);
    });

    it('소셜 로그인 성공 후 토큰이 state와 storage에 저장된다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      mockUserAPIGetUser.mockResolvedValue({
        name: '테스트',
        email: 'test@test.com',
      });

      await useAuth.getState().login('google');

      expect(mockAuthStorage.setAuthToken).toHaveBeenCalledWith(
        'new-access-token',
        'new-refresh-token',
      );
      expect(useAuth.getState().accessToken).toBe('new-access-token');
      expect(useAuth.getState().refreshToken).toBe('new-refresh-token');
    });

    it('소셜 로그인 성공 후 userAPI.getUser()가 호출된다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'token',
      });
      mockUserAPIGetUser.mockResolvedValue({
        name: '테스트',
        email: 'test@test.com',
      });

      await useAuth.getState().login('google');

      expect(mockUserAPIGetUser).toHaveBeenCalled();
    });

    it('userAPI.getUser() 성공 시 name, email이 state와 storage에 저장된다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'token',
      });
      mockUserAPIGetUser.mockResolvedValue({
        name: '홍길동',
        email: 'hong@test.com',
      });

      await useAuth.getState().login('google');

      expect(mockAuthStorage.setUserInfo).toHaveBeenCalledWith(
        '홍길동',
        'hong@test.com',
      );
      expect(useAuth.getState().name).toBe('홍길동');
      expect(useAuth.getState().email).toBe('hong@test.com');
    });

    it('userAPI.getUser() 성공 시 isLoggedIn이 true로 설정된다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'token',
      });
      mockUserAPIGetUser.mockResolvedValue({
        name: '테스트',
        email: 'test@test.com',
      });

      await useAuth.getState().login('google');

      expect(useAuth.getState().isLoggedIn).toBe(true);
    });

    it('소셜 로그인 실패 시 errorMessage를 반환한다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        errorMessage: '로그인 실패',
      });

      const result = await useAuth.getState().login('google');

      expect(result).toEqual({ errorMessage: '로그인 실패' });
    });

    it('소셜 로그인에서 토큰을 받지 못하면 auth.error.tokenFailed 에러 메시지를 반환한다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        accessToken: '',
        refreshToken: '',
      });

      const result = await useAuth.getState().login('google');

      expect(result).toEqual({ errorMessage: 'auth.error.tokenFailed' });
    });

    it('userAPI.getUser() 실패 시 auth.error.unexpected 에러 메시지를 반환한다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'token',
      });
      mockUserAPIGetUser.mockRejectedValue(new Error('User fetch failed'));

      const result = await useAuth.getState().login('google');

      expect(result).toEqual({ errorMessage: 'auth.error.unexpected' });
    });

    it('로그인 완료/실패 후 isLoading이 false로 설정된다', async () => {
      mockSignInWithGoogle.mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'token',
      });
      mockUserAPIGetUser.mockResolvedValue({
        name: '테스트',
        email: 'test@test.com',
      });

      await useAuth.getState().login('google');

      expect(useAuth.getState().isLoading).toBe(false);
    });

    it('로그인 실패 후에도 isLoading이 false로 설정된다', async () => {
      mockSignInWithGoogle.mockRejectedValue(new Error('Login failed'));

      await useAuth.getState().login('google');

      expect(useAuth.getState().isLoading).toBe(false);
    });
  });

  describe('logout 함수', () => {
    beforeEach(() => {
      useAuth.setState({
        name: '테스트유저',
        email: 'test@test.com',
        accessToken: 'current-access-token',
        refreshToken: 'current-refresh-token',
        isLoggedIn: true,
        isLoading: false,
      });
    });

    it('로그아웃 시작 시 현재 accessToken을 저장한다', async () => {
      mockAuthAPILogout.mockResolvedValue({});

      await useAuth.getState().logout();

      expect(mockAuthAPILogout).toHaveBeenCalledWith('current-access-token');
    });

    it('authStorage.clearAuthInfo()가 호출되어 로컬 storage를 정리한다', async () => {
      mockAuthAPILogout.mockResolvedValue({});

      await useAuth.getState().logout();

      expect(mockAuthStorage.clearAuthInfo).toHaveBeenCalled();
    });

    it('state가 초기화된다', async () => {
      mockAuthAPILogout.mockResolvedValue({});

      await useAuth.getState().logout();

      const state = useAuth.getState();
      expect(state.name).toBeNull();
      expect(state.email).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isLoggedIn).toBe(false);
    });

    it('authAPI.logout()이 저장된 accessToken으로 호출된다', async () => {
      mockAuthAPILogout.mockResolvedValue({});

      await useAuth.getState().logout();

      expect(mockAuthAPILogout).toHaveBeenCalledWith('current-access-token');
    });

    it('authAPI.logout() 실패해도 에러를 무시하고 로그아웃이 완료된다', async () => {
      mockAuthAPILogout.mockRejectedValue(new Error('Logout API failed'));

      await useAuth.getState().logout();

      const state = useAuth.getState();
      expect(state.isLoggedIn).toBe(false);
      expect(state.accessToken).toBeNull();
    });

    it('로그아웃 후 router.replace(ROUTES.HOME)으로 이동한다', async () => {
      mockAuthAPILogout.mockResolvedValue({});

      await useAuth.getState().logout();

      expect(mockRouterReplace).toHaveBeenCalledWith('/home');
    });
  });

  describe('clearAuth 함수', () => {
    beforeEach(() => {
      useAuth.setState({
        name: '테스트유저',
        email: 'test@test.com',
        accessToken: 'current-access-token',
        refreshToken: 'current-refresh-token',
        isLoggedIn: true,
        isLoading: false,
      });
    });

    it('authStorage.clearAuthInfo()를 호출한다', () => {
      useAuth.getState().clearAuth();

      expect(mockAuthStorage.clearAuthInfo).toHaveBeenCalled();
    });

    it('state를 초기화한다', () => {
      useAuth.getState().clearAuth();

      const state = useAuth.getState();
      expect(state.name).toBeNull();
      expect(state.email).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isLoggedIn).toBe(false);
    });

    it('logout과 달리 router 이동이 없다', () => {
      useAuth.getState().clearAuth();

      expect(mockRouterReplace).not.toHaveBeenCalled();
    });

    it('logout과 달리 API 호출이 없다', () => {
      useAuth.getState().clearAuth();

      expect(mockAuthAPILogout).not.toHaveBeenCalled();
    });
  });

  describe('setAuthToken 함수', () => {
    it('authStorage.setAuthToken()을 호출한다', () => {
      useAuth.getState().setAuthToken('new-access', 'new-refresh');

      expect(mockAuthStorage.setAuthToken).toHaveBeenCalledWith(
        'new-access',
        'new-refresh',
      );
    });

    it('state에 accessToken, refreshToken을 설정한다', () => {
      useAuth.getState().setAuthToken('new-access', 'new-refresh');

      const state = useAuth.getState();
      expect(state.accessToken).toBe('new-access');
      expect(state.refreshToken).toBe('new-refresh');
    });

    it('isLoggedIn이 true로 설정된다', () => {
      useAuth.setState({ isLoggedIn: false });

      useAuth.getState().setAuthToken('new-access', 'new-refresh');

      expect(useAuth.getState().isLoggedIn).toBe(true);
    });

    it('isLoading이 false로 설정된다', () => {
      useAuth.setState({ isLoading: true });

      useAuth.getState().setAuthToken('new-access', 'new-refresh');

      expect(useAuth.getState().isLoading).toBe(false);
    });
  });

  describe('setUserInfo 함수', () => {
    it('authStorage.setUserInfo()를 호출한다', () => {
      useAuth.getState().setUserInfo('홍길동', 'hong@test.com');

      expect(mockAuthStorage.setUserInfo).toHaveBeenCalledWith(
        '홍길동',
        'hong@test.com',
      );
    });

    it('state에 name, email을 설정한다', () => {
      useAuth.getState().setUserInfo('홍길동', 'hong@test.com');

      const state = useAuth.getState();
      expect(state.name).toBe('홍길동');
      expect(state.email).toBe('hong@test.com');
    });
  });
});
