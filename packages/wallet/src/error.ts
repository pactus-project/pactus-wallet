/**
 * Custom errors for wallet operations
 */

/*
 *
 * TODO: better error management
 *
 */
/**
 * Standard error codes used throughout the wallet
 */
export const ErrorCode = {
  WALLET_ERROR: 'WALLET_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  MNEMONIC_ERROR: 'MNEMONIC_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TX_ERROR: 'TX_ERROR',
  INIT_ERROR: 'INIT_ERROR',
  WALLET_CREATION_ERROR: 'WALLET_CREATION_ERROR',
  WALLET_RESTORE_ERROR: 'WALLET_RESTORE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Base class for wallet errors
 */
export class WalletError extends Error {
  code: ErrorCodeType = ErrorCode.WALLET_ERROR;

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
 * Create a standardized error response object
 * @param errorCode Error code
 * @param message Error message
 * @param details Optional error details
 * @returns Standardized error response object
 */
export function createErrorResponse(
  errorCode: ErrorCodeType | string,
  message: string,
  details?: unknown
): { error: { code: string; message: string; details?: unknown } } {
  return {
    error: {
      code: errorCode,
      message,
      details,
    },
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
    // Use the error's own code
    return createErrorResponse(error.code, error.message);
  } else if (error instanceof Error) {
    // Handle generic Error instances
    return createErrorResponse(ErrorCode.UNKNOWN_ERROR, error.message);
  }

  // Handle non-Error instances
  return createErrorResponse(ErrorCode.UNKNOWN_ERROR, 'An unknown error occurred', error);
}
