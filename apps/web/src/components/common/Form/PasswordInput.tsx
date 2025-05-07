import React, { useState } from 'react';
import Image from 'next/image';
import { hidePasswordIcon, showPasswordIcon } from '@/assets';

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  className?: string;
  disabled?: boolean;
  ariaDescribedby?: string;
  ariaInvalid?: boolean | 'false' | 'true';
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md' | 'lg';
  iconSize?: number;
  customErrorDisplay?: boolean;
}

/**
 * PasswordInput - A reusable password input component with show/hide functionality
 */
const PasswordInput: React.FC<PasswordInputProps> = ({
  id = 'password',
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  className = '',
  disabled = false,
  ariaDescribedby,
  ariaInvalid,
  autoComplete = 'current-password',
  onKeyDown,
  size = 'md',
  iconSize = 20,
  customErrorDisplay = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  // Define padding classes based on size
  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base',
  };

  // Determine border color based on error state
  const borderClass = error ? 'border-error' : 'border-border focus:border-primary';

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid || (error && !customErrorDisplay ? 'true' : 'false')}
        className={`w-full rounded-md bg-surface text-text-primary border ${borderClass} focus:outline-none pr-12 
          ${sizeClasses[size]}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''} 
          ${className}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        disabled={disabled}
        className="absolute z-10 right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Image
          src={showPassword ? hidePasswordIcon : showPasswordIcon}
          alt=""
          width={iconSize}
          height={iconSize}
        />
      </button>
      {error && !customErrorDisplay && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
