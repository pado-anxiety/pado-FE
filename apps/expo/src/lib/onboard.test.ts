import { isOnboarded, setIsOnboarded } from './onboard';
import { storage } from './store';

jest.mock('./store', () => ({
  storage: {
    getBoolean: jest.fn(),
    set: jest.fn(),
  },
}));

const mockStorage = storage as jest.Mocked<typeof storage>;

describe('onboard utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isOnboarded', () => {
    it('storage에 값이 없으면 false를 반환하고 false로 설정한다', () => {
      mockStorage.getBoolean.mockReturnValue(undefined);

      const result = isOnboarded();

      expect(result).toBe(false);
      expect(mockStorage.set).toHaveBeenCalledWith('onboard_status', false);
    });

    it('storage에 true가 있으면 true를 반환한다', () => {
      mockStorage.getBoolean.mockReturnValue(true);

      const result = isOnboarded();

      expect(result).toBe(true);
      expect(mockStorage.set).not.toHaveBeenCalled();
    });

    it('storage에 false가 있으면 false를 반환한다', () => {
      mockStorage.getBoolean.mockReturnValue(false);

      const result = isOnboarded();

      expect(result).toBe(false);
      expect(mockStorage.set).not.toHaveBeenCalled();
    });
  });

  describe('setIsOnboarded', () => {
    it('true로 설정할 수 있다', () => {
      setIsOnboarded(true);

      expect(mockStorage.set).toHaveBeenCalledWith('onboard_status', true);
    });

    it('false로 설정할 수 있다', () => {
      setIsOnboarded(false);

      expect(mockStorage.set).toHaveBeenCalledWith('onboard_status', false);
    });
  });
});
