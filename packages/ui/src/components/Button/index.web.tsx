import { useMemo } from 'react';
import { button } from './styles';
import type { ButtonWebProps } from './types';

export default function Button({
  text = '',
  isLoading = false,
  className = '',
  textClassName = '',
  color = 'primary',
  size = 'default',
  disabled = false,
  fullWidth = true,
  testID,
  onClick,
  children,
  type = 'button',
}: ButtonWebProps) {
  const styles = useMemo(
    () => button({ color, size, disabled, fullWidth }),
    [color, size, disabled, fullWidth]
  );

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      data-testid={testID}
      onClick={onClick}
      className={styles.container({ className })}
    >
      {children ? (
        children
      ) : (
        <>
          {isLoading ? (
            <svg
              data-testid={`${testID}-activity-indicator`}
              className={`${styles.indicator()} animate-spin`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <span data-testid={`${testID}-text`} className={styles.label({ className: textClassName })}>
              {text}
            </span>
          )}
        </>
      )}
    </button>
  );
}
