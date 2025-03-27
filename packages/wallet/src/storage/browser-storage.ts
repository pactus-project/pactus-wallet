import { IStorage } from './storage';

/**
 * Browser localStorage implementation of IStorage
 * Provides persistent storage in web browsers
 */
export class BrowserStorage implements IStorage {
  get = async <R>(key: string): Promise<R | null> => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as R) : null;
  };

  set = async <R>(key: string, payload: R): Promise<R | null> => {
    localStorage.setItem(key, JSON.stringify(payload));
    return payload;
  };

  setBatch = async <V extends Record<string, unknown>>(
    values: V
  ): Promise<V> => {
    Object.entries(values).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    return values;
  };

  delete = async <R>(key: string): Promise<R | null> => {
    const payload = await this.get<R>(key);
    if (payload != null) {
      localStorage.removeItem(key);
    }
    return payload;
  };

  clear = async (): Promise<void> => {
    localStorage.clear();
  };
}
