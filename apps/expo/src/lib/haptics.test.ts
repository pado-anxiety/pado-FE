import { getHapticState, setHapticState, triggerHaptic } from './haptics';

const mockImpactAsync = jest.fn();
const mockSelectionAsync = jest.fn();

jest.mock('expo-haptics', () => ({
  impactAsync: (...args: unknown[]) => mockImpactAsync(...args),
  selectionAsync: () => mockSelectionAsync(),
  ImpactFeedbackStyle: { Medium: 'medium', Light: 'light' },
}));

jest.mock('./store', () => {
  let state: boolean | undefined = undefined;
  return {
    storage: {
      getBoolean: jest.fn(() => state),
      set: jest.fn((_key: string, value: boolean) => { state = value; }),
    },
  };
});

const { storage } = require('./store') as { storage: { getBoolean: jest.Mock; set: jest.Mock } };

describe('haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHapticState', () => {
    it('값이 없으면 true로 설정하고 true를 반환한다', () => {
      storage.getBoolean.mockReturnValue(undefined);
      const result = getHapticState();
      expect(result).toBe(true);
      expect(storage.set).toHaveBeenCalledWith('haptics_state', true);
    });

    it('저장된 값이 있으면 그대로 반환한다', () => {
      storage.getBoolean.mockReturnValue(false);
      expect(getHapticState()).toBe(false);
    });
  });

  describe('setHapticState', () => {
    it('상태를 storage에 저장한다', () => {
      setHapticState(false);
      expect(storage.set).toHaveBeenCalledWith('haptics_state', false);
    });
  });

  describe('triggerHaptic', () => {
    it('활성화 상태에서 NAVIGATE 타입이면 Medium 진동을 실행한다', () => {
      storage.getBoolean.mockReturnValue(true);
      triggerHaptic('NAVIGATE');
      expect(mockImpactAsync).toHaveBeenCalledWith('medium');
    });

    it('활성화 상태에서 SELECT 타입이면 Selection 진동을 실행한다', () => {
      storage.getBoolean.mockReturnValue(true);
      triggerHaptic('SELECT');
      expect(mockSelectionAsync).toHaveBeenCalled();
    });

    it('비활성화 상태에서는 진동을 실행하지 않는다', () => {
      storage.getBoolean.mockReturnValue(false);
      triggerHaptic('NAVIGATE');
      expect(mockImpactAsync).not.toHaveBeenCalled();
      expect(mockSelectionAsync).not.toHaveBeenCalled();
    });
  });
});
