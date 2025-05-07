import React from 'react';
import Image from 'next/image';
import { simpleLogo } from '../../assets/images/branding';

interface TextInputProps {
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
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  hideLabel?: boolean;
  showLogo?: boolean;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}

const TextInput: React.FC<TextInputProps> = ({
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
  onBlur,
  label,
  hideLabel = false,
  rightElement,
  autoComplete,
  showLogo = false,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {!hideLabel && label && (
        <div className="flex items-center gap-1">
          <label htmlFor={id} className={`text-sm font-medium text-quaternary ${labelClassName}`}>
            {label}
          </label>
          {showLogo && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-text-quaternary">
                (
                <Image src={simpleLogo} alt="Pactus logo" className="w-5 h-5 inline-block" />)
              </span>
            </div>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full p-3 rounded-md bg-background text-text-primary text-sm border border-border focus:outline-none focus:border-primary ${
            rightElement ? 'pr-16' : ''
          } ${className}`}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
