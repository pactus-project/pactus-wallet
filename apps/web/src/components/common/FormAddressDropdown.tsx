import React from 'react';
import AddressDropdown from './AddressDropdown';

interface AddressOption {
  address: string;
  name?: string;
  icon?: React.ReactNode;
}

interface FormAddressDropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: AddressOption[];
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  touched?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  label?: string;
  hideLabel?: boolean;
  showAddressFormat?: 'full' | 'truncated';
}

/**
 * FormAddressDropdown - A wrapper around AddressDropdown that adds form validation
 */
const FormAddressDropdown: React.FC<FormAddressDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
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
  showAddressFormat = 'truncated',
}) => {
  const showError = touched && error;
  const inputClassName = showError ? `${className} border-error` : className;

  return (
    <div className="flex flex-col gap-1">
      <AddressDropdown
        value={value}
        onChange={onChange}
        options={options}
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
        showAddressFormat={showAddressFormat}
      />
      {showError && <div className="text-xs text-red-500 mt-1 pl-1">{error}</div>}
    </div>
  );
};

export default FormAddressDropdown;
