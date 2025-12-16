import { renderHook } from '@testing-library/react-native';
import { useChatKeyboard } from '../../hooks/useChatKeyboard';

// Mock dependencies
const mockUseSharedValue = jest.fn();
const mockUseAnimatedStyle = jest.fn();
const mockUseKeyboardHandler = jest.fn();
const mockUseSafeAreaInsets = jest.fn();

jest.mock('react-native-reanimated', () => ({
  useSharedValue: mockUseSharedValue,
  useAnimatedStyle: mockUseAnimatedStyle,
}));

jest.mock('react-native-keyboard-controller', () => ({
  useKeyboardHandler: mockUseKeyboardHandler,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: mockUseSafeAreaInsets,
}));

describe('useChatKeyboard', () => {
  let mockSharedValue: { value: number };
  let mockAnimatedStyle: any;
  let keyboardHandlerCallback: ((e: { height: number }) => void) | null;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock shared value
    mockSharedValue = { value: 0 };
    mockUseSharedValue.mockReturnValue(mockSharedValue);

    // Setup mock animated style
    mockAnimatedStyle = { paddingBottom: 16 };
    mockUseAnimatedStyle.mockImplementation((callback) => {
      // Store the worklet function and execute it
      const result = callback();
      return result;
    });

    // Setup mock keyboard handler
    keyboardHandlerCallback = null;
    mockUseKeyboardHandler.mockImplementation((config) => {
      keyboardHandlerCallback = config.onMove;
    });

    // Setup default safe area insets
    mockUseSafeAreaInsets.mockReturnValue({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  describe('Initialization', () => {
    it('should initialize with keyboard height of 0', () => {
      renderHook(() => useChatKeyboard());

      expect(mockUseSharedValue).toHaveBeenCalledWith(0);
    });

    it('should call useKeyboardHandler with onMove callback', () => {
      renderHook(() => useChatKeyboard());

      expect(mockUseKeyboardHandler).toHaveBeenCalledWith({
        onMove: expect.any(Function),
      });
    });

    it('should call useSafeAreaInsets', () => {
      renderHook(() => useChatKeyboard());

      expect(mockUseSafeAreaInsets).toHaveBeenCalled();
    });

    it('should return keyboardHeight and inputAnimatedStyle', () => {
      const { result } = renderHook(() => useChatKeyboard());

      expect(result.current).toHaveProperty('keyboardHeight');
      expect(result.current).toHaveProperty('inputAnimatedStyle');
    });
  });

  describe('Keyboard Height Management', () => {
    it('should update keyboardHeight when keyboard moves', () => {
      renderHook(() => useChatKeyboard());

      expect(keyboardHandlerCallback).not.toBeNull();

      if (keyboardHandlerCallback) {
        keyboardHandlerCallback({ height: 300 });
        expect(mockSharedValue.value).toBe(300);
      }
    });

    it('should handle keyboard opening with different heights', () => {
      renderHook(() => useChatKeyboard());

      const heights = [100, 200, 300, 400, 500];
      heights.forEach((height) => {
        if (keyboardHandlerCallback) {
          keyboardHandlerCallback({ height });
          expect(mockSharedValue.value).toBe(height);
        }
      });
    });

    it('should handle keyboard closing (height = 0)', () => {
      renderHook(() => useChatKeyboard());

      if (keyboardHandlerCallback) {
        // Open keyboard
        keyboardHandlerCallback({ height: 300 });
        expect(mockSharedValue.value).toBe(300);

        // Close keyboard
        keyboardHandlerCallback({ height: 0 });
        expect(mockSharedValue.value).toBe(0);
      }
    });

    it('should handle rapid keyboard height changes', () => {
      renderHook(() => useChatKeyboard());

      if (keyboardHandlerCallback) {
        keyboardHandlerCallback({ height: 100 });
        keyboardHandlerCallback({ height: 200 });
        keyboardHandlerCallback({ height: 150 });
        keyboardHandlerCallback({ height: 300 });
        
        expect(mockSharedValue.value).toBe(300);
      }
    });
  });

  describe('Animated Style Calculation', () => {
    it('should calculate paddingBottom with keyboard height and offset', () => {
      mockUseSafeAreaInsets.mockReturnValue({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      });

      mockUseAnimatedStyle.mockImplementation((callback) => {
        mockSharedValue.value = 300;
        return callback();
      });

      const { result } = renderHook(() => useChatKeyboard());

      expect(result.current.inputAnimatedStyle.paddingBottom).toBe(316); // 300 + 16
    });

    it('should use safe area bottom inset when keyboard is closed', () => {
      mockUseSafeAreaInsets.mockReturnValue({
        top: 0,
        bottom: 34,
        left: 0,
        right: 0,
      });

      mockUseAnimatedStyle.mockImplementation((callback) => {
        mockSharedValue.value = 0;
        return callback();
      });

      const { result } = renderHook(() => useChatKeyboard());

      expect(result.current.inputAnimatedStyle.paddingBottom).toBe(50); // max(0, 34) + 16
    });

    it('should use keyboard height when it exceeds safe area inset', () => {
      mockUseSafeAreaInsets.mockReturnValue({
        top: 0,
        bottom: 34,
        left: 0,
        right: 0,
      });

      mockUseAnimatedStyle.mockImplementation((callback) => {
        mockSharedValue.value = 300;
        return callback();
      });

      const { result } = renderHook(() => useChatKeyboard());

      expect(result.current.inputAnimatedStyle.paddingBottom).toBe(316); // max(300, 34) + 16
    });

    it('should handle zero safe area insets', () => {
      mockUseSafeAreaInsets.mockReturnValue({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      });

      mockUseAnimatedStyle.mockImplementation((callback) => {
        mockSharedValue.value = 0;
        return callback();
      });

      const { result } = renderHook(() => useChatKeyboard());

      expect(result.current.inputAnimatedStyle.paddingBottom).toBe(16); // max(0, 0) + 16
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative keyboard height (should not happen but be defensive)', () => {
      renderHook(() => useChatKeyboard());

      if (keyboardHandlerCallback) {
        keyboardHandlerCallback({ height: -10 });
        expect(mockSharedValue.value).toBe(-10);
      }
    });

    it('should handle very large keyboard heights', () => {
      renderHook(() => useChatKeyboard());

      if (keyboardHandlerCallback) {
        keyboardHandlerCallback({ height: 10000 });
        expect(mockSharedValue.value).toBe(10000);
      }
    });

    it('should handle fractional keyboard heights', () => {
      renderHook(() => useChatKeyboard());

      if (keyboardHandlerCallback) {
        keyboardHandlerCallback({ height: 299.5 });
        expect(mockSharedValue.value).toBe(299.5);
      }
    });

    it('should handle different safe area configurations', () => {
      const safeAreaConfigs = [
        { top: 44, bottom: 0, left: 0, right: 0 },
        { top: 0, bottom: 34, left: 0, right: 0 },
        { top: 44, bottom: 34, left: 0, right: 0 },
        { top: 20, bottom: 20, left: 0, right: 0 },
      ];

      safeAreaConfigs.forEach((insets) => {
        mockUseSafeAreaInsets.mockReturnValue(insets);
        
        const { result } = renderHook(() => useChatKeyboard());
        
        expect(result.current.inputAnimatedStyle).toBeDefined();
      });
    });
  });

  describe('Return Value Structure', () => {
    it('should return keyboardHeight as SharedValue', () => {
      const { result } = renderHook(() => useChatKeyboard());

      expect(result.current.keyboardHeight).toBe(mockSharedValue);
      expect(result.current.keyboardHeight).toHaveProperty('value');
    });

    it('should return inputAnimatedStyle with paddingBottom property', () => {
      mockUseAnimatedStyle.mockImplementation((callback) => {
        return callback();
      });

      const { result } = renderHook(() => useChatKeyboard());

      expect(result.current.inputAnimatedStyle).toHaveProperty('paddingBottom');
      expect(typeof result.current.inputAnimatedStyle.paddingBottom).toBe('number');
    });
  });

  describe('Hook Stability', () => {
    it('should maintain stable return values across re-renders', () => {
      const { result, rerender } = renderHook(() => useChatKeyboard());

      const firstKeyboardHeight = result.current.keyboardHeight;
      const firstAnimatedStyle = result.current.inputAnimatedStyle;

      rerender();

      expect(result.current.keyboardHeight).toBe(firstKeyboardHeight);
      // Animated style may change based on implementation
    });
  });

  describe('Integration with React Native Keyboard Controller', () => {
    it('should pass correct configuration to useKeyboardHandler', () => {
      renderHook(() => useChatKeyboard());

      const callConfig = mockUseKeyboardHandler.mock.calls[0][0];
      expect(callConfig).toHaveProperty('onMove');
      expect(typeof callConfig.onMove).toBe('function');
    });

    it('should handle keyboard events in sequence', () => {
      renderHook(() => useChatKeyboard());

      if (keyboardHandlerCallback) {
        // Simulate keyboard opening gradually
        keyboardHandlerCallback({ height: 50 });
        expect(mockSharedValue.value).toBe(50);

        keyboardHandlerCallback({ height: 150 });
        expect(mockSharedValue.value).toBe(150);

        keyboardHandlerCallback({ height: 300 });
        expect(mockSharedValue.value).toBe(300);

        // Simulate keyboard closing gradually
        keyboardHandlerCallback({ height: 200 });
        expect(mockSharedValue.value).toBe(200);

        keyboardHandlerCallback({ height: 100 });
        expect(mockSharedValue.value).toBe(100);

        keyboardHandlerCallback({ height: 0 });
        expect(mockSharedValue.value).toBe(0);
      }
    });
  });

  describe('Math.max behavior in animated style', () => {
    it('should correctly use Math.max with keyboard height greater than insets', () => {
      mockUseSafeAreaInsets.mockReturnValue({
        top: 0,
        bottom: 34,
        left: 0,
        right: 0,
      });

      mockUseAnimatedStyle.mockImplementation((callback) => {
        mockSharedValue.value = 350;
        return callback();
      });

      const { result } = renderHook(() => useChatKeyboard());

      // max(350, 34) + 16 = 366
      expect(result.current.inputAnimatedStyle.paddingBottom).toBe(366);
    });

    it('should correctly use Math.max with keyboard height less than insets', () => {
      mockUseSafeAreaInsets.mockReturnValue({
        top: 0,
        bottom: 50,
        left: 0,
        right: 0,
      });

      mockUseAnimatedStyle.mockImplementation((callback) => {
        mockSharedValue.value = 30;
        return callback();
      });

      const { result } = renderHook(() => useChatKeyboard());

      // max(30, 50) + 16 = 66
      expect(result.current.inputAnimatedStyle.paddingBottom).toBe(66);
    });

    it('should correctly use Math.max with equal values', () => {
      mockUseSafeAreaInsets.mockReturnValue({
        top: 0,
        bottom: 34,
        left: 0,
        right: 0,
      });

      mockUseAnimatedStyle.mockImplementation((callback) => {
        mockSharedValue.value = 34;
        return callback();
      });

      const { result } = renderHook(() => useChatKeyboard());

      // max(34, 34) + 16 = 50
      expect(result.current.inputAnimatedStyle.paddingBottom).toBe(50);
    });
  });

  describe('Multiple hook instances', () => {
    it('should handle multiple independent hook instances', () => {
      const { result: result1 } = renderHook(() => useChatKeyboard());
      const { result: result2 } = renderHook(() => useChatKeyboard());

      expect(result1.current).toBeDefined();
      expect(result2.current).toBeDefined();
      // Each instance should get its own mocked values
    });
  });
});