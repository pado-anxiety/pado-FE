import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChatModalHeader from '../../components/ChatModalHeader';

describe('ChatModalHeader', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ChatModalHeader onBack={mockOnBack} />);
      expect(container).toBeTruthy();
    });

    it('should render back icon', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const Entypo = require('@expo/vector-icons').Entypo;
      const icon = UNSAFE_getByType(Entypo);
      expect(icon).toBeTruthy();
    });

    it('should render Entypo icon with correct name', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const Entypo = require('@expo/vector-icons').Entypo;
      const icon = UNSAFE_getByType(Entypo);
      expect(icon.props.name).toBe('chevron-thin-left');
    });

    it('should render icon with correct size', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const Entypo = require('@expo/vector-icons').Entypo;
      const icon = UNSAFE_getByType(Entypo);
      expect(icon.props.size).toBe(24);
    });

    it('should render icon with correct color', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const Entypo = require('@expo/vector-icons').Entypo;
      const icon = UNSAFE_getByType(Entypo);
      expect(icon.props.color).toBe('rgb(224, 224, 224)');
    });
  });

  describe('Interaction', () => {
    it('should call onBack when back button is pressed', () => {
      const onBack = jest.fn();
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={onBack} />);
      
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      fireEvent.press(button);
      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('should call onBack multiple times on multiple presses', () => {
      const onBack = jest.fn();
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={onBack} />);
      
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);
      
      expect(onBack).toHaveBeenCalledTimes(3);
    });

    it('should not crash when onBack is called', () => {
      const onBack = jest.fn();
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={onBack} />);
      
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      expect(() => fireEvent.press(button)).not.toThrow();
    });
  });

  describe('Hit Slop', () => {
    it('should have hit slop for better touch target', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      expect(button.props.hitSlop).toEqual({
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      });
    });

    it('should have consistent hit slop values', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);
      const hitSlop = button.props.hitSlop;

      expect(hitSlop.top).toBe(hitSlop.bottom);
      expect(hitSlop.left).toBe(hitSlop.right);
    });
  });

  describe('Layout and Styling', () => {
    it('should have flex row layout', () => {
      const { UNSAFE_getByProps } = render(<ChatModalHeader onBack={mockOnBack} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('flex-row') 
      });
      expect(container).toBeTruthy();
    });

    it('should have justify-start alignment', () => {
      const { UNSAFE_getByProps } = render(<ChatModalHeader onBack={mockOnBack} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('justify-start') 
      });
      expect(container).toBeTruthy();
    });

    it('should have gap between elements', () => {
      const { UNSAFE_getByProps } = render(<ChatModalHeader onBack={mockOnBack} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('gap-2') 
      });
      expect(container).toBeTruthy();
    });

    it('should have horizontal padding', () => {
      const { UNSAFE_getByProps } = render(<ChatModalHeader onBack={mockOnBack} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('px-4') 
      });
      expect(container).toBeTruthy();
    });

    it('should have bottom padding', () => {
      const { UNSAFE_getByProps } = render(<ChatModalHeader onBack={mockOnBack} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('pb-3') 
      });
      expect(container).toBeTruthy();
    });

    it('should have full width', () => {
      const { UNSAFE_getByProps } = render(<ChatModalHeader onBack={mockOnBack} />);
      const container = UNSAFE_getByProps({ 
        className: expect.stringContaining('w-full') 
      });
      expect(container).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should contain a Pressable component', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const Pressable = require('react-native-gesture-handler').Pressable;
      expect(UNSAFE_getByType(Pressable)).toBeTruthy();
    });

    it('should contain a View wrapper', () => {
      const { UNSAFE_getAllByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const View = require('@src/components/ui').View;
      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });

    it('should nest icon inside Pressable', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const Entypo = require('@expo/vector-icons').Entypo;
      const icon = UNSAFE_getByType(Entypo);
      const Pressable = require('react-native-gesture-handler').Pressable;
      
      expect(icon.parent?.type).toBe(Pressable);
    });
  });

  describe('Props Handling', () => {
    it('should accept onBack function prop', () => {
      const onBack = jest.fn();
      expect(() => render(<ChatModalHeader onBack={onBack} />)).not.toThrow();
    });

    it('should work with arrow function', () => {
      const onBack = () => console.log('back');
      expect(() => render(<ChatModalHeader onBack={onBack} />)).not.toThrow();
    });

    it('should work with named function', () => {
      function handleBack() {
        console.log('back');
      }
      expect(() => render(<ChatModalHeader onBack={handleBack} />)).not.toThrow();
    });

    it('should handle onBack with side effects', () => {
      let sideEffect = false;
      const onBack = () => { sideEffect = true; };
      
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={onBack} />);
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      fireEvent.press(button);
      expect(sideEffect).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid button presses', () => {
      const onBack = jest.fn();
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={onBack} />);
      
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      for (let i = 0; i < 10; i++) {
        fireEvent.press(button);
      }

      expect(onBack).toHaveBeenCalledTimes(10);
    });

    it('should not crash with empty onBack function', () => {
      const onBack = () => {};
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={onBack} />);
      
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      expect(() => fireEvent.press(button)).not.toThrow();
    });

    it('should handle async onBack function', async () => {
      const onBack = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={onBack} />);
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      fireEvent.press(button);
      expect(onBack).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<ChatModalHeader onBack={mockOnBack} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should handle multiple renders efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        render(<ChatModalHeader onBack={mockOnBack} />);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(200);
    });
  });

  describe('Re-rendering', () => {
    it('should update when onBack prop changes', () => {
      const onBack1 = jest.fn();
      const onBack2 = jest.fn();
      
      const { rerender, UNSAFE_getByType } = render(
        <ChatModalHeader onBack={onBack1} />
      );
      
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      fireEvent.press(button);
      expect(onBack1).toHaveBeenCalled();
      expect(onBack2).not.toHaveBeenCalled();

      rerender(<ChatModalHeader onBack={onBack2} />);
      fireEvent.press(button);
      
      expect(onBack2).toHaveBeenCalled();
    });

    it('should handle multiple re-renders', () => {
      const { rerender } = render(<ChatModalHeader onBack={mockOnBack} />);

      for (let i = 0; i < 5; i++) {
        const newOnBack = jest.fn();
        rerender(<ChatModalHeader onBack={newOnBack} />);
      }

      expect(true).toBe(true); // Should not crash
    });
  });

  describe('Accessibility', () => {
    it('should have a pressable component for accessibility', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const Pressable = require('react-native-gesture-handler').Pressable;
      expect(UNSAFE_getByType(Pressable)).toBeTruthy();
    });

    it('should have adequate hit slop for touch accessibility', () => {
      const { UNSAFE_getByType } = render(<ChatModalHeader onBack={mockOnBack} />);
      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);
      
      const hitSlop = button.props.hitSlop;
      expect(hitSlop.top).toBeGreaterThanOrEqual(20);
      expect(hitSlop.bottom).toBeGreaterThanOrEqual(20);
      expect(hitSlop.left).toBeGreaterThanOrEqual(20);
      expect(hitSlop.right).toBeGreaterThanOrEqual(20);
    });
  });

  describe('Integration', () => {
    it('should work in typical chat modal context', () => {
      let modalVisible = true;
      const handleBack = () => { modalVisible = false; };

      const { UNSAFE_getByType } = render(
        <ChatModalHeader onBack={handleBack} />
      );

      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      expect(modalVisible).toBe(true);
      fireEvent.press(button);
      expect(modalVisible).toBe(false);
    });

    it('should integrate with state management', () => {
      const stateManager = {
        isModalOpen: true,
        closeModal: function() { this.isModalOpen = false; },
      };

      const { UNSAFE_getByType } = render(
        <ChatModalHeader onBack={() => stateManager.closeModal()} />
      );

      const Pressable = require('react-native-gesture-handler').Pressable;
      const button = UNSAFE_getByType(Pressable);

      expect(stateManager.isModalOpen).toBe(true);
      fireEvent.press(button);
      expect(stateManager.isModalOpen).toBe(false);
    });
  });

  describe('TypeScript Type Safety', () => {
    it('should accept function with no parameters', () => {
      const onBack = () => {};
      expect(() => render(<ChatModalHeader onBack={onBack} />)).not.toThrow();
    });

    it('should work with strongly typed callback', () => {
      const onBack: () => void = () => {};
      expect(() => render(<ChatModalHeader onBack={onBack} />)).not.toThrow();
    });
  });

  describe('Snapshot Testing', () => {
    it('should match snapshot', () => {
      const { toJSON } = render(<ChatModalHeader onBack={mockOnBack} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});