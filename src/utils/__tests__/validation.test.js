import { validateEmail, validateRequired, validatePassword } from '../validation';

describe('validation utils', () => {
    describe('validateEmail', () => {
        it('should return true for valid emails', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@domain.co.uk')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('test@')).toBe(false);
            expect(validateEmail('@domain.com')).toBe(false);
            expect(validateEmail('test@domain')).toBe(false);
            expect(validateEmail('')).toBe(false);
        });
    });

    describe('validateRequired', () => {
        it('should return true for non-empty values', () => {
            expect(validateRequired('hello')).toBe(true);
            expect(validateRequired(0)).toBe(true);
            expect(validateRequired(false)).toBe(true);
        });

        it('should return false for empty values', () => {
            expect(validateRequired('')).toBe(false);
            expect(validateRequired('   ')).toBe(false);
            expect(validateRequired(null)).toBe(false);
            expect(validateRequired(undefined)).toBe(false);
        });
    });

    describe('validatePassword', () => {
        it('should return true for valid passwords (min 6 chars and at least one number)', () => {
            expect(validatePassword('pass123')).toBe(true);
            expect(validatePassword('123456')).toBe(true);
        });

        it('should return false for invalid passwords', () => {
            expect(validatePassword('12345')).toBe(false); // too short
            expect(validatePassword('password')).toBe(false); // no number
            expect(validatePassword('')).toBe(false);
        });
    });
});
