import React from 'react';
import MemoInput from './MemoInput';

interface FormMemoInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  hideLabel?: boolean;
}

const FormMemoInput: React.FC<FormMemoInputProps> = ({
  value,
  onChange,
  maxLength = 64,
  placeholder = 'Enter memo (optional)',
  id = 'memo',
  name = 'memo',
  className = '',
  disabled = false,
  required = false,
  error,
  touched,
  onBlur,
  label = 'Memo',
  hideLabel = false,
}) => {
  const showError = touched && error;
  const inputClassName = showError ? `${className} border-error` : className;

  return (
    <div className="flex flex-col gap-1">
      <MemoInput
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        id={id}
        name={name}
        className={inputClassName}
        disabled={disabled}
        required={required}
        onBlur={onBlur}
        label={label}
        hideLabel={hideLabel}
      />
      {showError && <div className="text-xs text-error mt-1 pl-1">{error}</div>}
    </div>
  );
};

export default FormMemoInput;
