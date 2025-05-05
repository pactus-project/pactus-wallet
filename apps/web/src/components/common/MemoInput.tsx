import React from 'react';

interface MemoInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  placeholder?: string;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  hideLabel?: boolean;
}

const MemoInput: React.FC<MemoInputProps> = ({
  value,
  onChange,
  maxLength = 64,
  placeholder = 'Enter memo (optional)',
  id = 'memo',
  name = 'memo',
  className = '',
  disabled = false,
  required = false,
  onBlur,
  label = 'Memo',
  hideLabel = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {!hideLabel && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full p-3 rounded-md bg-surface text-text-primary text-sm border border-border focus:outline-none focus:border-primary ${className}`}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
        <span className="absolute right-3 bottom-3 text-xs text-text-tertiary">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default MemoInput;
