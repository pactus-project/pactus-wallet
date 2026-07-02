import { SPECIAL_CHARACTERS, PASSWORD_VALIDATORS } from './constants';

/**
 * Checks if a string contains at least one special character
 * @param str - The string to check
 * @returns True if the string contains at least one special character
 */
export const containsSpecialCharacter = (str: string): boolean => {
  const specialCharRegex = new RegExp(`[${SPECIAL_CHARACTERS}]`);
  return specialCharRegex.test(str);
};

/**
 * Checks if a string meets the minimum length requirement
 * @param str - The string to check
 * @returns True if the string meets the minimum length
 */
export const meetsMinLength = (str: string): boolean => {
  return str.length >= PASSWORD_VALIDATORS.MIN_LENGTH;
};

/**
 * Checks if a string contains at least one uppercase letter
 * @param str - The string to check
 * @returns True if the string contains at least one uppercase letter
 */
export const containsUppercase = (str: string): boolean => {
  return PASSWORD_VALIDATORS.HAS_UPPERCASE.test(str);
};

/**
 * Checks if a string contains at least one lowercase letter
 * @param str - The string to check
 * @returns True if the string contains at least one lowercase letter
 */
export const containsLowercase = (str: string): boolean => {
  return PASSWORD_VALIDATORS.HAS_LOWERCASE.test(str);
};

/**
 * Checks if a string contains at least one number
 * @param str - The string to check
 * @returns True if the string contains at least one number
 */
export const containsNumber = (str: string): boolean => {
  return PASSWORD_VALIDATORS.HAS_NUMBER.test(str);
};

/**
 * Gets a detailed validation result for a password
 * @param password - The password to validate
 * @returns An object with detailed validation results
 */
export const getPasswordValidationDetails = (password: string) => {
  return {
    meetsMinLength: meetsMinLength(password),
    hasUppercase: containsUppercase(password),
    hasLowercase: containsLowercase(password),
    hasNumber: containsNumber(password),
    hasSpecialChar: containsSpecialCharacter(password),
  };
};
