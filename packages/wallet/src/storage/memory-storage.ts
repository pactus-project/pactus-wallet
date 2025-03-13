import { IStorage } from './storage';

/**
 * In-memory storage implementation of IStorage
 * Provides temporary storage in memory
 */
export class MemoryStorage implements IStorage {
    storage: Record<string, unknown> = {};

    get = async <R>(key: string) => {
        return (this.storage[key] as R) ?? null;
    };

    set = async <R>(key: string, payload: R) => {
        this.storage[key] = payload;
        return payload;
    };

    setBatch = async <V extends Record<string, unknown>>(values: V) => {
        Object.assign(this.storage, values);
        return values;
    };

    delete = async <R>(key: string) => {
        const payload = await this.get<R>(key);
        if (payload != null) {
            delete this.storage[key];
        }
        return payload;
    };

    clear = async () => {
        this.storage = {};
    };
}
