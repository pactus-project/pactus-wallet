import type { IStorage } from './storage';

/**
 * Browser localStorage implementation of IStorage
 * Provides persistent storage in web browsers
 */
export class BrowserStorage implements IStorage {
  get = (key: string): string | null => localStorage.getItem(key);

  has = (key: string): boolean => localStorage.getItem(key) !== null;

  set = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  };

  delete = (key: string): void => {
    localStorage.removeItem(key);
  };
}
