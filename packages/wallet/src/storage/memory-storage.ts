import { IStorage } from './storage';

/** In-memory storage implementation of IStorage. */
export class MemoryStorage implements IStorage {
  private storage: Record<string, string> = {};

  get = (key: string): string | null => {
    return this.storage[key] ?? null;
  };

  has = (key: string): boolean => {
    return key in this.storage;
  };

  set = (key: string, value: string): void => {
    this.storage[key] = value;
  };

  delete = (key: string): void => {
    delete this.storage[key];
  };
}
