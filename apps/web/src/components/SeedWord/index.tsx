'use client';
import React from 'react';
import './style.css';

export interface SeedWordProps {
  index: number;
  word?: string;
  editable?: boolean;
  value?: string;
  onChange?: (index: number, value: string) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  hasError?: boolean;
  isSuccess?: boolean;
  className?: string;
}

const SeedWord: React.FC<SeedWordProps> = ({
  index,
  word,
  editable = false,
  value = '',
  onChange,
  onPaste,
  hasError = false,
  isSuccess = false,
  className = '',
}) => {
  // Using existing styling classes for error/success states
  const errorSuccessClass = hasError
    ? 'recovery-phrase__word--error'
    : isSuccess
      ? 'recovery-phrase__word--success'
      : '';

  return (
    <div className={`flex items-center p-2 bg-[#242424] rounded-md w-full ${errorSuccessClass} ${className}`}>
      <label 
        htmlFor={editable ? `word-${index}` : undefined} 
        className="text-sm ml-1 mr-1 text-muted"
      >
        {index}.
      </label>
      
      {editable ? (
        <input
          id={`word-${index}`}
          type="text"
          className="import-wallet__word-input w-full"
          value={value}
          data-index={index - 1}
          onChange={(e) => onChange?.(index - 1, e.target.value)}
          onPaste={onPaste}
          aria-invalid={hasError ? 'true' : 'false'}
          autoComplete="off"
        />
      ) : (
        <span className="text-base text-white overflow-hidden text-ellipsis whitespace-nowrap">{word}</span>
      )}
    </div>
  );
};

export { default as SeedWordGrid } from './SeedWordGrid';
export default SeedWord;
