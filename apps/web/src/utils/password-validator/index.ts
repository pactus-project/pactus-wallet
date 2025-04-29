import { getPasswordValidationDetails } from '../password-utils';

/**
 * Validates if a password meets all security requirements
 * @param password - The password to validate
 * @returns True if the password meets all requirements
 */
export const validatePassword = (password: string): boolean => {
  const validationDetails = getPasswordValidationDetails(password);

  // All rules must pass
  return Object.values(validationDetails).every(rule => rule === true);
};
