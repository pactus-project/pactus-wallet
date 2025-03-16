export const validatePassword = (password: string): boolean => {
    // Core validation rules
    const rules = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[~!@#$%^&*()_\-+=]/.test(password)
    };

    // All rules must pass
    return Object.values(rules).every(rule => rule === true);
}