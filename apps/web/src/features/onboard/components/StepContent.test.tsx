import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import koOnboard from '@pado/locales/ko/onboard.json';

import { StepContent } from './StepContent';

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
  },
}));

// Mock @pado/ui
vi.mock('@pado/ui', () => ({
  Button: ({
    text,
    onClick,
    disabled,
  }: {
    text: string;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="next-button"
    >
      {text}
    </button>
  ),
}));

// 번역 데이터
const step1 = koOnboard.steps.step1;

describe('StepContent', () => {
  const mockOnNext = vi.fn();

  const defaultProps = {
    step: {
      texts: step1.texts,
      buttonText: step1.button,
    },
    visibleTexts: [0, 1, 2],
    showButton: true,
    isExiting: false,
    onNext: mockOnNext,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('스텝 텍스트가 렌더링된다', () => {
    render(<StepContent {...defaultProps} />);

    step1.texts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('버튼 텍스트가 렌더링된다', () => {
    render(<StepContent {...defaultProps} />);

    expect(screen.getByTestId('next-button')).toHaveTextContent(step1.button);
  });

  it('버튼 클릭 시 onNext가 호출된다', () => {
    render(<StepContent {...defaultProps} />);

    fireEvent.click(screen.getByTestId('next-button'));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('showButton이 false일 때 버튼이 비활성화된다', () => {
    render(
      <StepContent
        {...defaultProps}
        showButton={false}
      />,
    );

    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  it('isExiting이 true일 때 버튼이 비활성화된다', () => {
    render(
      <StepContent
        {...defaultProps}
        isExiting={true}
      />,
    );

    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

});
