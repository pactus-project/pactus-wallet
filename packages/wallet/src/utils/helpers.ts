/**
 * Helper utilities for wallet management
 */
import { MnemonicStrength } from '../wallet';

/**
 * Validates password strength
 * @param password Password to validate
 * @returns Object with validation result and reason if invalid
 */
export function validatePassword(password: string): { isValid: boolean; reason?: string } {
    if (!password || password.length < 8) {
        return { isValid: false, reason: 'Password must be at least 8 characters' };
    }

    // Check for complexity requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!(hasUppercase && hasLowercase && (hasNumber || hasSpecial))) {
        return {
            isValid: false,
            reason: 'Password must contain uppercase, lowercase, and at least a number or special character'
        };
    }

    return { isValid: true };
}

/**
 * Formats a wallet address for display
 * @param address Full wallet address
 * @returns Shortened address with ellipsis in the middle
 */
export function formatAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Generates a random wallet name
 * @returns A random wallet name
 */
export function generateWalletName(): string {
    const adjectives = ['Brave', 'Mighty', 'Swift', 'Noble', 'Wise', 'Fierce', 'Gentle', 'Bold'];
    const nouns = ['Wallet', 'Guardian', 'Vault', 'Keeper', 'Treasury', 'Chest', 'Bastion'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
}

/**
 * Returns human-readable mnemonic strength description
 * @param strength Mnemonic strength value
 * @returns Description of mnemonic strength
 */
export function getMnemonicStrengthDescription(strength: MnemonicStrength): string {
    switch (strength) {
        case MnemonicStrength.Normal:
            return '12 words (Normal security)';
        case MnemonicStrength.High:
            return '24 words (High security)';
        default:
            return 'Unknown strength';
    }
}

/**
 * Estimates the time required to unlock a wallet based on password complexity
 * @param password Password to evaluate
 * @returns Estimated time description
 */
export function estimateUnlockTime(password: string): string {
    // This is a simplistic model - in a real app you'd use more sophisticated estimation
    if (!password) return 'Unknown';

    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    let score = 0;
    score += length * 4;
    if (hasUppercase) score += 5;
    if (hasLowercase) score += 5;
    if (hasNumber) score += 5;
    if (hasSpecial) score += 8;

    if (score < 20) return 'Very fast (weak password)';
    if (score < 40) return 'Fast';
    if (score < 60) return 'Moderate';
    if (score < 80) return 'Slow';
    return 'Very slow (strong password)';
}
