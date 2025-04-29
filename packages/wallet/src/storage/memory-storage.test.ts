import { MemoryStorage } from './memory-storage';

describe('MemoryStorage', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  describe('basic functionality', () => {
    test('should store and retrieve string values', () => {
      storage.set('key1', 'value1');
      expect(storage.get('key1')).toBe('value1');
    });

    test('should check if key exists', () => {
      storage.set('key1', 'value1');
      expect(storage.has('key1')).toBe(true);
      expect(storage.has('nonexistent')).toBe(false);
    });

    test('should delete keys', () => {
      storage.set('key1', 'value1');
      storage.delete('key1');
      expect(storage.get('key1')).toBe(null);
    });
  });

  describe('data type handling', () => {
    test('should store and retrieve numbers', () => {
      const number = 12345;
      storage.set('number', number.toString());
      expect(storage.get('number')).toBe(number.toString());

      const parsedNumber = Number(storage.get('number'));
      expect(parsedNumber).toBe(number);
    });

    test('should store and retrieve booleans', () => {
      storage.set('boolTrue', 'true');
      storage.set('boolFalse', 'false');

      expect(storage.get('boolTrue')).toBe('true');
      expect(storage.get('boolFalse')).toBe('false');

      const parsedTrue = storage.get('boolTrue') === 'true';
      const parsedFalse = storage.get('boolFalse') === 'true';

      expect(parsedTrue).toBe(true);
      expect(parsedFalse).toBe(false);
    });

    test('should store and retrieve objects as JSON', () => {
      const obj = { name: 'John', age: 30, isActive: true };
      storage.set('object', JSON.stringify(obj));

      const retrieved = storage.get('object');
      expect(retrieved).not.toBeNull();

      const parsedObj = JSON.parse(retrieved as string);
      expect(parsedObj).toEqual(obj);
    });

    test('should store and retrieve arrays as JSON', () => {
      const arr = [1, 2, 'three', true, { key: 'value' }];
      storage.set('array', JSON.stringify(arr));

      const retrieved = storage.get('array');
      expect(retrieved).not.toBeNull();

      const parsedArr = JSON.parse(retrieved as string);
      expect(parsedArr).toEqual(arr);
    });

    test('should store and retrieve null values', () => {
      const nullVal = null;
      storage.set('null', JSON.stringify(nullVal));

      const retrieved = storage.get('null');
      expect(retrieved).toBe('null');

      const parsedNull = JSON.parse(retrieved as string);
      expect(parsedNull).toBeNull();
    });
  });
});
