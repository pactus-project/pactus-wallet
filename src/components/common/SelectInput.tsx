import React from 'react';

interface SelectOption {
  value: string;
  label: React.ReactNode;
}

interface SelectInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
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
}

const SelectInput: React.FC<SelectInputProps> = ({
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
  onBlur,
  label,
  hideLabel = false,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {!hideLabel && label && (
        <label htmlFor={id} className={`text-sm font-medium text-quaternary ${labelClassName}`}>
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
          className={`w-full p-3 rounded-md bg-background text-tertiary 
            text-sm border border-border focus:outline-none
             focus:border-primary appearance-none hover:bg-background
           focus:bg-background ${className}`}
          disabled={disabled}
          required={required}
        >
          {placeholder && (
            <option value="" disabled className="text-disabled">
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option
              key={`${option.value}-${index}`}
              value={option.value}
              className="bg-background text-quaternary"
            >
              {option.label}
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

export default SelectInput;
