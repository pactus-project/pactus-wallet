/**
 * Custom errors for wallet operations
 */

/**
 * Enum for standard error codes used throughout the wallet
 */
export enum ErrorCode {
    WALLET_ERROR = 'WALLET_ERROR',
    AUTH_ERROR = 'AUTH_ERROR',
    MNEMONIC_ERROR = 'MNEMONIC_ERROR',
    STORAGE_ERROR = 'STORAGE_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    TX_ERROR = 'TX_ERROR',
    INIT_ERROR = 'INIT_ERROR',
    WALLET_CREATION_ERROR = 'WALLET_CREATION_ERROR',
    WALLET_RESTORE_ERROR = 'WALLET_RESTORE_ERROR',
    INVALID_MNEMONIC_ERROR = 'INVALID_MNEMONIC_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Base class for wallet errors
 */
export class WalletError extends Error {
    code = ErrorCode.WALLET_ERROR;

    constructor(message: string) {
        super(message);
        this.name = 'WalletError';
    }
}

/**
 * Error for authentication failures
 */
export class AuthenticationError extends WalletError {
    code = ErrorCode.AUTH_ERROR;

    constructor(message = 'Authentication failed. Wrong password.') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

/**
 * Error for invalid mnemonic phrases
 */
export class MnemonicError extends WalletError {
    code = ErrorCode.MNEMONIC_ERROR;

    constructor(message = 'Invalid mnemonic phrase.') {
        super(message);
        this.name = 'MnemonicError';
    }
}

/**
 * Error for wallet storage operations
 */
export class StorageError extends WalletError {
    code = ErrorCode.STORAGE_ERROR;

    constructor(message = 'Wallet storage operation failed.') {
        super(message);
        this.name = 'StorageError';
    }
}

/**
 * Error for network operations
 */
export class NetworkError extends WalletError {
    code = ErrorCode.NETWORK_ERROR;

    constructor(message = 'Network operation failed.') {
        super(message);
        this.name = 'NetworkError';
    }
}

/**
 * Error for wallet initialization
 */
export class InitializationError extends WalletError {
    code = ErrorCode.INIT_ERROR;

    constructor(message = 'Wallet initialization failed.') {
        super(message);
        this.name = 'InitializationError';
    }
}

/**
 * Error for wallet creation failures
 */
export class WalletCreationError extends WalletError {
    code = ErrorCode.WALLET_CREATION_ERROR;

    constructor(message = 'Failed to create wallet') {
        super(message);
        this.name = 'WalletCreationError';
    }
}

/**
 * Error for wallet restoration failures
 */
export class WalletRestoreError extends WalletError {
    code = ErrorCode.WALLET_RESTORE_ERROR;

    constructor(message = 'Failed to restore wallet') {
        super(message);
        this.name = 'WalletRestoreError';
    }
}

/**
 * Error for invalid mnemonic input
 */
export class InvalidMnemonicError extends WalletError {
    code = ErrorCode.INVALID_MNEMONIC_ERROR;

    constructor(message = 'Invalid mnemonic phrase') {
        super(message);
        this.name = 'InvalidMnemonicError';
    }
}
/**
 * Create a standardized error message with error code
 * @param code Error code for categorizing errors
 * @param message Human-readable error message
 * @param details Optional additional error details
 * @returns Standardized error response object
 */
export function createErrorResponse(code: ErrorCode | string, message: string, details?: unknown) {
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
        let code = ErrorCode.WALLET_ERROR;

        if (error instanceof AuthenticationError) code = ErrorCode.AUTH_ERROR;
        else if (error instanceof MnemonicError) code = ErrorCode.MNEMONIC_ERROR;
        else if (error instanceof StorageError) code = ErrorCode.STORAGE_ERROR;
        else if (error instanceof NetworkError) code = ErrorCode.NETWORK_ERROR;
        else if (error instanceof InitializationError) code = ErrorCode.INIT_ERROR;
        else if (error instanceof WalletCreationError) code = ErrorCode.WALLET_CREATION_ERROR;
        else if (error instanceof WalletRestoreError) code = ErrorCode.WALLET_RESTORE_ERROR;
        else if (error instanceof InvalidMnemonicError) code = ErrorCode.INVALID_MNEMONIC_ERROR;

        return createErrorResponse(code, error.message);
    } else if (error instanceof Error) {
        // Handle generic Error instances
        return createErrorResponse(ErrorCode.UNKNOWN_ERROR, error.message);
    } else {
        // Handle non-Error instances
        return createErrorResponse(ErrorCode.UNKNOWN_ERROR, 'An unknown error occurred', error);
    }
}
