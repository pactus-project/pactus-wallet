import React from 'react';
import GradientText from './GradientText';
import { simpleLogo } from '../../assets/images/branding';
import Image from 'next/image';
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
  showLogo?: boolean;
  labelClassName?: string;
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
  showLogo = false,
  labelClassName = '',
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
              <span className="text-sm font-medium text-quaternary">
                (
                <Image src={simpleLogo} alt="Pactus logo" className="w-5 h-5 inline-block" />)
              </span>
            </div>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full p-3 rounded-md bg-background text-text-primary text-sm border border-border focus:outline-none focus:border-primary ${className}`}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
        <GradientText className="absolute right-3 bottom-3">
          {value.length}/{maxLength}
        </GradientText>
      </div>
    </div>
  );
};

export default MemoInput;
