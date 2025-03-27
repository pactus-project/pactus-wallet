export * from './browser-storage';
export * from './memory-storage';

/**
 * Interface for a generic storage system.
 */
export interface IStorage {
  /**
   * Retrieves a value from storage.
   * @param key - The key to look up.
   * @returns The stored value of type R, or null if the key does not exist.
   */
  get: <R>(key: string) => R | null;

  /**
   * Checks if a key exists in storage.
   * @param key - The key to check.
   * @returns True if the key exists, false otherwise.
   */
  has: (key: string) => boolean;

  /**
   * Stores a value in storage.
   * @param key - The key to associate with the value.
   * @param value - The value to store.
   */
  set: <R>(key: string, value: R) => void;

  /**
   * Stores multiple key-value pairs in storage at once.
   * @param values - An object containing key-value pairs to store.
   */
  setBatch: <V extends Record<string, unknown>>(values: V) => void;

  /**
   * Deletes a key from storage.
   * @param key - The key to remove.
   * @returns The deleted value of type R, or null if the key did not exist.
   */
  delete: <R>(key: string) => R | null;

  /**
   * Clears all stored values.
   */
  clear: () => void;
}
