import { IStorage } from './storage';

/**
 * Browser localStorage implementation of IStorage
 * Provides persistent storage in web browsers
 */
export class BrowserStorage implements IStorage {
  get = <R>(key: string): R | null => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as R) : null;
  };

  has = (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  };

  set = <R>(key: string, payload: R): void => {
    localStorage.setItem(key, JSON.stringify(payload));
  };

  setBatch = <V extends Record<string, unknown>>(values: V): void => {
    Object.entries(values).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  };

  delete = <R>(key: string): R | null => {
    const payload = this.get<R>(key);
    if (payload !== null) {
      localStorage.removeItem(key);
    }
    return payload;
  };

  clear = (): void => {
    localStorage.clear();
  };
}
