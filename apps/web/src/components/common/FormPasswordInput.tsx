import React from 'react';
import { PasswordInput } from '@/components/common/Form';

interface FormPasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  label?: string;
  hideLabel?: boolean;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md' | 'lg';
}

const FormPasswordInput: React.FC<FormPasswordInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter your password',
  id = 'password',
  className = '',
  disabled = false,
  error,
  touched,
  label = 'Password',
  hideLabel = false,
  autoComplete = 'current-password',
  onKeyDown,
  size = 'md',
}) => {
  const showError = touched && error;
  const inputClassName = showError ? `${className} border-error` : className;

  return (
    <div className="flex flex-col gap-1">
      {!hideLabel && (
        <label htmlFor={id} className="text-sm font-medium text-text-quaternary">
          {label}
        </label>
      )}
      <PasswordInput
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClassName}
        disabled={disabled}
        error={showError ? error : null}
        autoComplete={autoComplete}
        onKeyDown={onKeyDown}
        size={size}
        customErrorDisplay={true}
      />
      {showError && <div className="text-xs text-error mt-1 pl-1">{error}</div>}
    </div>
  );
};

export default FormPasswordInput;
