import { IAsyncStorage } from './async-storage';

/**
 * IndexedDB implementation of IAsyncStorage
 * Provides persistent storage in web browsers using async operations
 */
export class IndexedDBStorage implements IAsyncStorage {
  private dbName = 'PactusWalletStorage';

  private storeName = 'main';

  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.openDB();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async withStore<T>(
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    const db = await this.dbPromise;

    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(this.storeName, mode);
      const store = tx.objectStore(this.storeName);
      const request = callback(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(key: string): Promise<string | null> {
    return this.withStore('readonly', store => store.get(key));
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);

    return value !== undefined && value !== null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.withStore('readwrite', store => store.put(value, key));
  }

  async delete(key: string): Promise<void> {
    await this.withStore('readwrite', store => store.delete(key));
  }
}
