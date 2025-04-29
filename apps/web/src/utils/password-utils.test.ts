import {
  containsSpecialCharacter,
  meetsMinLength,
  containsUppercase,
  containsLowercase,
  containsNumber,
  getPasswordValidationDetails,
} from './password-utils';
import { SPECIAL_CHARACTERS } from './constants';

describe('Password Utilities', () => {
  describe('containsSpecialCharacter', () => {
    it('should return true when string contains a special character', () => {
      SPECIAL_CHARACTERS.split('').forEach(char => {
        expect(containsSpecialCharacter(`test${char}123`)).toBe(true);
      });
    });

    it('should return false when string contains no special characters', () => {
      expect(containsSpecialCharacter('testPassword123')).toBe(false);
    });
  });

  describe('meetsMinLength', () => {
    it('should return true when string meets minimum length', () => {
      expect(meetsMinLength('12345678')).toBe(true);
      expect(meetsMinLength('123456789')).toBe(true);
    });

    it('should return false when string is too short', () => {
      expect(meetsMinLength('1234567')).toBe(false);
    });
  });

  describe('containsUppercase', () => {
    it('should return true when string contains uppercase letter', () => {
      expect(containsUppercase('testPassword')).toBe(true);
      expect(containsUppercase('Password')).toBe(true);
      expect(containsUppercase('ALLCAPS')).toBe(true);
    });

    it('should return false when string has no uppercase letter', () => {
      expect(containsUppercase('testpassword')).toBe(false);
    });
  });

  describe('containsLowercase', () => {
    it('should return true when string contains lowercase letter', () => {
      expect(containsLowercase('testPassword')).toBe(true);
      expect(containsLowercase('password')).toBe(true);
      expect(containsLowercase('PASSWORd')).toBe(true);
    });

    it('should return false when string has no lowercase letter', () => {
      expect(containsLowercase('PASSWORD')).toBe(false);
    });
  });

  describe('containsNumber', () => {
    it('should return true when string contains a number', () => {
      expect(containsNumber('testPassword1')).toBe(true);
      expect(containsNumber('123password')).toBe(true);
      expect(containsNumber('pass2word')).toBe(true);
    });

    it('should return false when string has no number', () => {
      expect(containsNumber('testPassword')).toBe(false);
    });
  });

  describe('getPasswordValidationDetails', () => {
    it('should return correct validation details for valid password', () => {
      const validPassword = 'TestPass1!';
      const result = getPasswordValidationDetails(validPassword);

      expect(result.meetsMinLength).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasNumber).toBe(true);
      expect(result.hasSpecialChar).toBe(true);
    });

    it('should return correct validation details for invalid password', () => {
      const invalidPassword = 'test';
      const result = getPasswordValidationDetails(invalidPassword);

      expect(result.meetsMinLength).toBe(false);
      expect(result.hasUppercase).toBe(false);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasNumber).toBe(false);
      expect(result.hasSpecialChar).toBe(false);
    });
  });
});
