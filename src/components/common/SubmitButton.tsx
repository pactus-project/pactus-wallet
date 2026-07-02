import React from 'react';

interface SubmitButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  children: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  children,
  fullWidth = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-white hover:bg-primary-light';
      case 'secondary':
        return 'bg-secondary text-white hover:bg-secondary-light';
      case 'outlined':
        return 'bg-transparent text-primary border border-primary hover:bg-primary-light/10';
      default:
        return 'bg-primary text-white hover:bg-primary-light';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 text-sm';
      case 'medium':
        return 'px-6 py-3';
      case 'large':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3';
    }
  };

  return (
    <button
      type={type}
      className={`${getVariantClasses()} ${getSizeClasses()} rounded-md font-medium transition-colors disabled:bg-surface-medium disabled:text-text-disabled ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
