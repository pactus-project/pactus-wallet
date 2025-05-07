import React from 'react';
import SelectInput from './SelectInput';

interface SelectOption {
  value: string;
  label: React.ReactNode;
}

interface FormSelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  label?: string;
  hideLabel?: boolean;
}

const FormSelectInput: React.FC<FormSelectInputProps> = ({
  value,
  onChange,
  options,
  placeholder,
  id,
  name,
  className = '',
  disabled = false,
  required = false,
  error,
  touched,
  onBlur,
  label,
  hideLabel = false,
}) => {
  const showError = touched && error;
  const inputClassName = showError ? `${className} border-error` : className;

  return (
    <div className="flex flex-col gap-1">
      <SelectInput
        value={value}
        onChange={onChange}
        options={options}
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

export default FormSelectInput;
