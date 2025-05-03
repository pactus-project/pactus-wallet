import { validatePassword } from './index';
import { SPECIAL_CHARACTERS } from '../constants';

describe('Password Validation Rules', () => {
  describe('Length Requirements', () => {
    it('should accept passwords with 8 or more characters', () => {
      expect(validatePassword('TestPass1!')).toBe(true);
    });

    it('should reject passwords with less than 8 characters', () => {
      expect(validatePassword('Test1!')).toBe(false);
    });
  });

  describe('Character Requirements', () => {
    it('should require at least one uppercase letter', () => {
      expect(validatePassword('lowercase1!')).toBe(false);
      expect(validatePassword('Lowercase1!')).toBe(true);
    });

    it('should require at least one lowercase letter', () => {
      expect(validatePassword('UPPERCASE1!')).toBe(false);
      expect(validatePassword('UPPERCASEa1!')).toBe(true);
    });

    it('should require at least one number', () => {
      expect(validatePassword('Password!@')).toBe(false);
      expect(validatePassword('Password1!@')).toBe(true);
    });

    it('should require at least one special character', () => {
      SPECIAL_CHARACTERS.split('').forEach(char => {
        const password = `Password1${char}`;
        expect(validatePassword(password)).toBe(true);
      });
    });
  });

  describe('Complex Password Scenarios', () => {
    const validPasswords = [
      'Complex1@Password',
      'Strong#Pass123',
      'Test$123User',
      'Secure^789Pass',
    ];

    validPasswords.forEach(password => {
      it(`should accept valid password: ${password.replace(/./g, '*')}`, () => {
        expect(validatePassword(password)).toBe(true);
      });
    });
  });
});
