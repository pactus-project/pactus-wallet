import { validatePassword } from './index';

describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
        expect(validatePassword('Valid1@123')).toBe(true);
        expect(validatePassword('AnotherValid1!')).toBe(true);
    });

    it('should return false for passwords without uppercase letters', () => {
        expect(validatePassword('invalid1@')).toBe(false);
    });

    it('should return false for passwords without lowercase letters', () => {
        expect(validatePassword('INVALID1@')).toBe(false);
    });

    it('should return false for passwords without numbers', () => {
        expect(validatePassword('Invalid@')).toBe(false);
    });

    it('should return false for passwords without special characters', () => {
        expect(validatePassword('Invalid1')).toBe(false);
    });

    it('should return false for passwords shorter than 8 characters', () => {
        expect(validatePassword('Inv1@')).toBe(false);
    });

    it('should return true for a complex valid password', () => {
        expect(validatePassword('Complex1@Password')).toBe(true);
    });
});