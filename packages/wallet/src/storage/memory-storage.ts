import { IStorage } from './storage';

/** In-memory storage implementation of IStorage. */
export class MemoryStorage implements IStorage {
  private storage: Record<string, unknown> = {};

  get = <R>(key: string): R | null => {
    return (this.storage[key] as R) ?? null;
  };

  has = (key: string): boolean => {
    return key in this.storage;
  };

  set = <R>(key: string, payload: R): void => {
    this.storage[key] = payload;
  };

  setBatch = <V extends Record<string, unknown>>(values: V): void => {
    Object.assign(this.storage, values);
  };

  delete = <R>(key: string): R | null => {
    const payload = this.get<R>(key);
    if (payload !== null) {
      delete this.storage[key];
    }

    return payload;
  };

  clear = (): void => {
    this.storage = {};
  };
}
