import React from 'react';
import TextInput from './TextInput';

interface FormTextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  hideLabel?: boolean;
  rightElement?: React.ReactNode;
  autoComplete?: string;
  showLogo?: boolean;
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  id,
  name,
  className = '',
  labelClassName = '',
  disabled = false,
  required = false,
  error,
  touched,
  onBlur,
  label,
  hideLabel = false,
  rightElement,
  autoComplete,
  showLogo = false,
}) => {
  const showError = touched && error;
  const inputClassName = showError ? `${className} border-error` : className;

  return (
    <div className="flex flex-col gap-1">
      <TextInput
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        id={id}
        name={name}
        className={inputClassName}
        labelClassName={labelClassName}
        disabled={disabled}
        required={required}
        onBlur={onBlur}
        label={label}
        hideLabel={hideLabel}
        rightElement={rightElement}
        autoComplete={autoComplete}
        showLogo={showLogo}
      />
      {showError && <div className="text-xs text-error mt-1 pl-1">{error}</div>}
    </div>
  );
};

export default FormTextInput;
