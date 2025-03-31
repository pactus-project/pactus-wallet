import { IStorage } from './storage';

/**
 * Browser localStorage implementation of IStorage
 * Provides persistent storage in web browsers
 */
export class BrowserStorage implements IStorage {
  /**
   * Custom serializer that handles Maps and other non-JSON native types
   */
  private serialize(data: unknown): string {
    return JSON.stringify(data, (key, value) => {
      // Handle Map objects
      if (value instanceof Map) {
        return {
          dataType: 'Map',
          value: Array.from(value.entries()),
        };
      }
      return value;
    });
  }

  /**
   * Custom deserializer that revives Maps and other non-JSON native types
   */
  private deserialize<T>(text: string): T {
    return JSON.parse(text, (key, value) => {
      // Revive Map objects
      if (
        value &&
        typeof value === 'object' &&
        value.dataType === 'Map' &&
        Array.isArray(value.value)
      ) {
        return new Map(value.value);
      }
      return value;
    }) as T;
  }

  get = <R>(key: string): R | null => {
    const item = localStorage.getItem(key);
    return item ? this.deserialize<R>(item) : null;
  };

  has = (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  };

  set = <R>(key: string, payload: R): void => {
    localStorage.setItem(key, this.serialize(payload));
  };

  setBatch = <V extends Record<string, unknown>>(values: V): void => {
    Object.entries(values).forEach(([key, value]) => {
      localStorage.setItem(key, this.serialize(value));
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
