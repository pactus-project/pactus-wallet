import { IndexedDBStorage } from './indexdb-storage';

describe('IndexedDBStorage', () => {
  let storage: IndexedDBStorage;

  beforeEach(() => {
    storage = new IndexedDBStorage();
  });

  afterEach(async () => {
    indexedDB.deleteDatabase('PactusWalletStorage');
  });

  describe('basic functionality', () => {
    test('should store and retrieve string values', async () => {
      await storage.set('key1', 'value1');
      const value = await storage.get('key1');
      expect(value).toBe('value1');
    });

    test('should check if key exists', async () => {
      await storage.set('key1', 'value1');
      const exists = await storage.has('key1');
      const notExists = await storage.has('nonexistent');
      expect(exists).toBe(true);
      expect(notExists).toBe(false);
    });

    test('should delete keys', async () => {
      await storage.set('key1', 'value1');
      await storage.delete('key1');
      const value = await storage.get('key1');
      expect(value).toBeUndefined();
    });
  });

  describe('data type handling', () => {
    test('should store and retrieve numbers', async () => {
      const number = 12345;
      await storage.set('number', number.toString());
      const raw = await storage.get('number');
      expect(raw).toBe(number.toString());
      expect(Number(raw)).toBe(number);
    });

    test('should store and retrieve booleans', async () => {
      await storage.set('boolTrue', 'true');
      await storage.set('boolFalse', 'false');

      const trueVal = await storage.get('boolTrue');
      const falseVal = await storage.get('boolFalse');

      expect(trueVal).toBe('true');
      expect(falseVal).toBe('false');

      expect(trueVal === 'true').toBe(true);
      expect(falseVal === 'true').toBe(false);
    });

    test('should store and retrieve objects as JSON', async () => {
      const obj = { name: 'John', age: 30, isActive: true };
      await storage.set('object', JSON.stringify(obj));
      const raw = await storage.get('object');
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw as string)).toEqual(obj);
    });

    test('should store and retrieve arrays as JSON', async () => {
      const arr = [1, 2, 'three', true, { key: 'value' }];
      await storage.set('array', JSON.stringify(arr));
      const raw = await storage.get('array');
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw as string)).toEqual(arr);
    });

    test('should store and retrieve null values', async () => {
      const nullVal = null;
      await storage.set('null', JSON.stringify(nullVal));
      const raw = await storage.get('null');
      expect(raw).toBe('null');
      expect(JSON.parse(raw as string)).toBeNull();
    });
  });
});
