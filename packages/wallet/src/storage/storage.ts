export * from './browser-storage';
export * from './memory-storage';
export interface IStorage {
    get: <R>(key: string) => Promise<R | null>;
    set: <R>(key: string, value: R) => Promise<R | null>;
    setBatch: <V extends Record<string, unknown>>(values: V) => Promise<V>;
    delete: <R>(key: string) => Promise<R | null>;
    clear: () => Promise<void>;
}
