import React, { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Label text for the checkbox
   */
  label?: string | ReactNode;
  /**
   * Description text that appears below the label
   */
  description?: string | ReactNode;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Custom class name for the label
   */
  labelClassName?: string;
  /**
   * Custom class name for the description
   */
  descriptionClassName?: string;
  /**
   * Size of the checkbox (small, medium, large)
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If the checkbox is indeterminate
   */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      className,
      labelClassName,
      descriptionClassName,
      size = 'medium',
      indeterminate = false,
      disabled = false,
      checked,
      onChange,
      id,
      ...rest
    },
    ref
  ) => {
    const uniqueId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    // Set the indeterminate property on the input element when it changes
    React.useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    // Size classes
    const sizeClasses = {
      small: 'h-4 w-4',
      medium: 'h-5 w-5',
      large: 'h-6 w-6',
    };

    const labelSizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    return (
      <div className={clsx('flex flex-col', className)}>
        <div className="flex items-start cursor-pointer">
          <div className="flex-shrink-0 mt-0.5">
            <input
              id={uniqueId}
              ref={ref}
              type="checkbox"
              className={clsx(
                sizeClasses[size],
                'rounded border-gray-300 text-primary-500 focus:ring-primary-500',
                'cursor-pointer transition-colors',
                disabled && 'opacity-50 cursor-not-allowed',
                error && 'border-red-500'
              )}
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={
                description ? `${uniqueId}-description` : error ? `${uniqueId}-error` : undefined
              }
              {...rest}
            />
          </div>

          {(label || description) && (
            <div className="ml-2 text-left flex-grow">
              <label
                htmlFor={uniqueId}
                className={clsx(
                  labelSizeClasses[size],
                  'text-text-primary font-normal select-none cursor-pointer inline-flex flex-wrap items-center',
                  disabled && 'opacity-50 cursor-not-allowed',
                  error && 'text-red-500',
                  labelClassName
                )}
              >
                <span className="flex-shrink-0">{label}</span>
                {typeof description !== 'string' && description && (
                  <span className="inline-flex items-center whitespace-nowrap">{description}</span>
                )}
              </label>

              {typeof description === 'string' && (
                <div
                  id={`${uniqueId}-description`}
                  className={clsx(
                    'text-gray-500 mt-1',
                    {
                      'text-sm': size === 'medium' || size === 'small',
                      'text-base': size === 'large',
                    },
                    descriptionClassName
                  )}
                >
                  {description}
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p id={`${uniqueId}-error`} className="mt-1 text-sm text-red-500 ml-6" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
