import React from 'react';

interface AddressOption {
  address: string;
  name?: string;
  icon?: React.ReactNode;
}

interface AddressDropdownProps {
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
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  label?: string;
  hideLabel?: boolean;
  showAddressFormat?: 'full' | 'truncated';
}

/**
 * AddressDropdown - A specialized dropdown component for wallet addresses
 */
const AddressDropdown: React.FC<AddressDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an address',
  id = 'address-dropdown',
  name = 'address',
  className = '',
  labelClassName = '',
  disabled = false,
  required = false,
  onBlur,
  label,
  hideLabel = false,
  showAddressFormat = 'truncated',
}) => {
  // Function to format the address based on showAddressFormat
  const formatAddress = (address: string) => {
    if (showAddressFormat === 'full') {
      return address;
    }
    // Truncate the address to show first 10 and last 8 characters
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`;
  };

  return (
    <div className="flex flex-col gap-3">
      {!hideLabel && label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium text-text-quaternary ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full p-3 rounded-md bg-background text-text-primary text-sm border border-border focus:outline-none focus:border-primary appearance-none hover:bg-background focus:bg-background ${className}`}
          disabled={disabled}
          required={required}
        >
          {placeholder && (
            <option value="" disabled className="text-quaternary">
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option
              key={option.address}
              value={option.address}
              className="bg-background text-text-primary py-2"
            >
              {option.name
                ? `${option.name} (${formatAddress(option.address)})`
                : formatAddress(option.address)}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AddressDropdown;
