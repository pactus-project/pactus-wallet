export * from './browser-storage';
export * from './memory-storage';

/**
 * Interface for a generic storage system.
 */
export interface IStorage {

  /**
   * Retrieves a value from storage.
   * @param key - The key to look up.
   * @returns The stored value as a string, or null if the key does not exist.
   */
  get: (key: string) => string | null;

  /**
   * Checks if a key exists in storage.
   * @param key - The key to check.
   * @returns True if the key exists, false otherwise.
   */
  has: (key: string) => boolean;

  /**
   * Stores a value in storage.
   * @param key - The key to associate with the value.
   * @param value - The value to store as a string.
   */
  set: (key: string, value: string) => void;

  /**
   * Deletes a key from storage.
   * @param key - The key to remove.
   */
  delete: (key: string) => void;
}
