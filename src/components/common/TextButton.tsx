import React from 'react';

interface TextButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

const TextButton: React.FC<TextButtonProps> = ({
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  children,
}) => {
  return (
    <button
      type={type}
      className={`text-primary text-xs font-medium py-1 px-2 rounded cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-light/10'
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default TextButton;
