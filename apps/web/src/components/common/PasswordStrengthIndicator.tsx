import React from 'react';
import { getPasswordValidationDetails } from '@/utils/password-utils';
import Image from 'next/image';
import { successIcon } from '@/assets';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
  isFocused?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className = '',
  isFocused = false,
}) => {
  const validationDetails = getPasswordValidationDetails(password);
  const totalChecks = Object.keys(validationDetails).length;
  const passedChecks = Object.values(validationDetails).filter(Boolean).length;
  const strengthPercentage = (passedChecks / totalChecks) * 100;

  const getStrengthColor = (percentage: number) => {
    if (percentage <= 20) return 'text-error';
    if (percentage <= 40) return 'text-orange-500';
    if (percentage <= 60) return 'text-yellow-500';
    if (percentage <= 80) return 'text-blue-500';
    return 'text-success';
  };

  const getStrengthText = (percentage: number) => {
    if (percentage <= 20) return 'Very Weak';
    if (percentage <= 40) return 'Weak';
    if (percentage <= 60) return 'Medium';
    if (percentage <= 80) return 'Strong';
    return 'Very Strong';
  };

  const requirements = [
    {
      label: 'At least 8 characters',
      isMet: validationDetails.meetsMinLength,
    },
    {
      label: 'Contains uppercase letter',
      isMet: validationDetails.hasUppercase,
    },
    {
      label: 'Contains lowercase letter',
      isMet: validationDetails.hasLowercase,
    },
    {
      label: 'Contains number',
      isMet: validationDetails.hasNumber,
    },
    {
      label: 'Contains special character',
      isMet: validationDetails.hasSpecialChar,
    },
  ];

  const isVeryStrong = strengthPercentage === 100;

  if (!password) return null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {isVeryStrong ? (
        <>
          <div className="flex items-center gap-2 text-success text-xs bg-success/10 p-2 rounded-md">
            <Image src={successIcon} alt="Success" width={16} height={16} />
            <span>Great! Your password meets all security requirements</span>
          </div>
        </>
      ) : (
        isFocused &&
        !isVeryStrong && (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Password Strength:</span>
              <span className={getStrengthColor(strengthPercentage)}>
                {getStrengthText(strengthPercentage)}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      requirement.isMet ? 'bg-success' : 'bg-surface-medium'
                    }`}
                  />
                  <span className={`${requirement.isMet ? 'text-success' : 'text-text-secondary'}`}>
                    {requirement.label}
                  </span>
                </div>
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
