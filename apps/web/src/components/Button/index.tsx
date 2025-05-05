import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variants
   */
  variant?: ButtonVariant;
  /**
   * Button size
   */
  size?: ButtonSize;
  /**
   * Is the button in a loading state?
   */
  isLoading?: boolean;
  /**
   * Button content
   */
  children: React.ReactNode;
  /**
   * Optional icon to display before the text
   */
  startIcon?: React.ReactNode;
  /**
   * Optional icon to display after the text
   */
  endIcon?: React.ReactNode;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Custom class names
   */
  className?: string;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  children,
  startIcon,
  endIcon,
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) => {
  // Base classes for all buttons
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:cursor-not-allowed';

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm h-8',
    medium: 'px-4 py-2.5 text-base h-12', // 12 * 4 = 48px
    large: 'px-6 py-3 text-lg h-14',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-primary text-white hover:opacity-90 disabled:opacity-50',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark disabled:bg-secondary/50',
    outlined:
      'border border-gray-300 bg-transparent text-text-primary hover:bg-gray-50 disabled:text-gray-300',
    text: 'bg-transparent text-text-primary hover:bg-gray-100 disabled:text-gray-300',
  };

  // Full width class
  const widthClass = fullWidth ? 'w-full' : '';

  // Loading state
  const loadingClass = isLoading ? 'relative text-transparent' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        widthClass,
        loadingClass,
        className
      )}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="ml-2">{endIcon}</span>}

      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
    </button>
  );
};

export default Button;
