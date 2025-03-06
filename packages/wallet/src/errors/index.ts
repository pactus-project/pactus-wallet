/**
 * Custom errors for wallet operations
 */

/**
 * Base class for wallet errors
 */
export class WalletError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WalletError';
    }
}

/**
 * Error for invalid authentication (wrong password)
 */
export class AuthenticationError extends WalletError {
    constructor(message: string = 'Authentication failed. Wrong password.') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

/**
 * Error for invalid mnemonic phrases
 */
export class MnemonicError extends WalletError {
    constructor(message: string = 'Invalid mnemonic phrase.') {
        super(message);
        this.name = 'MnemonicError';
    }
}

/**
 * Error for wallet storage operations
 */
export class StorageError extends WalletError {
    constructor(message: string = 'Wallet storage operation failed.') {
        super(message);
        this.name = 'StorageError';
    }
}

/**
 * Error for network operations
 */
export class NetworkError extends WalletError {
    constructor(message: string = 'Network operation failed.') {
        super(message);
        this.name = 'NetworkError';
    }
}

/**
 * Error for transaction operations
 */
export class TransactionError extends WalletError {
    constructor(message: string = 'Transaction operation failed.') {
        super(message);
        this.name = 'TransactionError';
    }
}

/**
 * Error for wallet initialization
 */
export class InitializationError extends WalletError {
    constructor(message: string = 'Wallet initialization failed.') {
        super(message);
        this.name = 'InitializationError';
    }
}

/**
 * Create a standardized error message with error code
 * @param code Error code for categorizing errors
 * @param message Human-readable error message
 * @param details Additional error details (optional)
 * @returns Formatted error object
 */
export function createErrorResponse(code: string, message: string, details?: unknown) {
    return {
        error: {
            code,
            message,
            details
        }
    };
}

/**
 * Format error for consistent response
 * @param error Error instance
 * @returns Standardized error response
 */
export function formatError(error: unknown): {
    error: { code: string; message: string; details?: unknown };
} {
    if (error instanceof WalletError) {
        // Handle known wallet errors
        let code = 'WALLET_ERROR';

        if (error instanceof AuthenticationError) code = 'AUTH_ERROR';
        else if (error instanceof MnemonicError) code = 'MNEMONIC_ERROR';
        else if (error instanceof StorageError) code = 'STORAGE_ERROR';
        else if (error instanceof NetworkError) code = 'NETWORK_ERROR';
        else if (error instanceof TransactionError) code = 'TX_ERROR';
        else if (error instanceof InitializationError) code = 'INIT_ERROR';

        return createErrorResponse(code, error.message);
    } else if (error instanceof Error) {
        // Handle generic Error instances
        return createErrorResponse('UNKNOWN_ERROR', error.message);
    } else {
        // Handle non-Error instances
        return createErrorResponse('UNKNOWN_ERROR', 'An unknown error occurred', error);
    }
}
