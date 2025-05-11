import React from 'react';
import { FormItem, PasswordInput } from '@/components/common/Form';
import { Rule } from 'rc-field-form/es/interface';

interface FormPasswordInputProps {
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md' | 'lg';
  rules?: Rule[];
}

const FormPasswordInput: React.FC<FormPasswordInputProps> = ({
  value,
  name = "password",
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
  onFocus,
  onBlur,
  size = 'md',
  rules,
}) => {
  const showError = touched && error;
  const inputClassName = showError ? `${className} border-error` : className;

  return (
    <div className='flex flex-col gap-3'>
      {!hideLabel && (
        <label htmlFor={id} className="text-sm font-medium text-quaternary w-fit">
          {label}
        </label>
      )}
      <FormItem name={name} className="flex flex-col gap-3" rules={rules}>
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
            onFocus={onFocus}
            onBlur={onBlur}
            size={size}
            customErrorDisplay={true}
          />
      </FormItem>
      {showError && <div className="text-xs text-error mt-1 pl-1">{error}</div>}
    </div>
  );
};

export default FormPasswordInput;
