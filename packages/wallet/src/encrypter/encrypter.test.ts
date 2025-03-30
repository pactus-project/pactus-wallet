import { DefaultMethod, Encrypter, ParameterKey } from './encrypter';
import { Params } from './params';

describe('Encrypter Tests', () => {
  // testParams are configured with minimal settings
  // for faster and more efficient tests
  let testParams = new Params();
  testParams.setNumber(ParameterKey.Iterations, 1);
  testParams.setNumber(ParameterKey.Memory, 8);
  testParams.setNumber(ParameterKey.Parallelism, 1);
  testParams.setNumber(ParameterKey.KeyLength, 48);

  it('should handle NoEncrypter', async () => {
    // Create an Encrypter with no encryption method
    const enc = Encrypter.noEncrypter();
    expect(enc.isEncrypted()).toBeFalsy();

    const msg = 'foo';

    // Trying to encrypt with a non-empty password should fail
    await expect(enc.encrypt(msg, 'password')).rejects.toThrow(
      'Invalid password'
    );

    const cipher = await enc.encrypt(msg, '');

    // Trying to decrypt with a non-empty password should fail
    await expect(enc.decrypt(cipher, 'password')).rejects.toThrow(
      'Invalid password'
    );

    // Decrypt with empty password, should succeed.
    const decipher = await enc.decrypt(cipher, '');
    expect(decipher).toBe(msg);
  });

  it('should handle defaultEncrypter', () => {
    const enc = Encrypter.defaultEncrypter();

    expect(enc.method).toBe('ARGON2ID-AES_256_CTR-MACV1');
    expect(enc.params.getNumber('iterations')).toBe(3);
    expect(enc.params.getNumber('memory')).toBe(65536);
    expect(enc.params.getNumber('parallelism')).toBe(4);
    expect(enc.params.getNumber('keylen')).toBe(48);
    expect(enc.isEncrypted()).toBeTruthy();
  });

  it('should handle encryption and decryption', async () => {
    const enc = new Encrypter(DefaultMethod, testParams);
    expect(enc.isEncrypted()).toBeTruthy();

    const msg = 'foo';
    const password = 'cowboy';

    // Trying to encrypt with empty password should fail
    await expect(enc.encrypt(msg, '')).rejects.toThrow('Invalid password');

    const cipher = await enc.encrypt(msg, password);

    await expect(enc.decrypt(cipher, '')).rejects.toThrow('Invalid password');

    await expect(enc.decrypt(cipher, 'invalid-password')).rejects.toThrow(
      'Invalid password'
    );

    const decipher = await enc.decrypt(cipher, password);
    expect(decipher).toBe(msg);
  });

  it('should throw error for invalid encryption methods', async () => {
    const tests = [
      { method: 'XXX-AES_256_CTR-MACV1' },
      { method: 'ARGON2ID-XXX-MACV1' },
      { method: 'ARGON2ID-AES_256_CTR-XXX' },
      { method: 'XXX' },
    ];

    for (const tt of tests) {
      const enc = new Encrypter(tt.method, testParams);

      await expect(enc.encrypt('foo', 'password')).rejects.toThrow(
        'Method not supported'
      );

      await expect(
        enc.decrypt('AJFPsGu6bDMJ5iuMWDJS/87xVs7r', 'password')
      ).rejects.toThrow('Method not supported');
    }
  });

  it('should handle invalid ciphers', async () => {
    const enc = new Encrypter(DefaultMethod, testParams);

    // Test decryption an empty ciphertext
    await expect(enc.decrypt('', 'password')).rejects.toThrow('Invalid cipher');

    // Test decryption with invalid base64 ciphertext
    await expect(enc.decrypt('invalid-base64', 'password')).rejects.toThrow(
      'Invalid cipher'
    );
  });

  it('Stream Cipher with keylen 48', async () => {
    const enc = new Encrypter(DefaultMethod, testParams);
    const msg = 'foo';
    const password = 'cowboy';
    const cipher = '8ADDJx3jXBQWKw3c7qwEkrTaZrBMrjQ=';

    const decipher = await enc.decrypt(cipher, password);
    expect(decipher).toBe(msg);
  });

  describe('JSON serialization', () => {
    test('should correctly serialize to JSON', () => {
      const params = new Params();
      params.setString('key1', 'val1');
      params.setNumber('key2', 5);

      const encrypter = new Encrypter('METHOD', params);
      const json = encrypter.toJSON();

      expect(json).toEqual({
        method: 'METHOD',
        params: {
          key1: 'val1',
          key2: '5',
        },
      });
    });

    test('should correctly deserialize from JSON', () => {
      const json = {
        method: 'METHOD',
        params: {
          key1: 'val1',
          key2: '5',
        },
      };

      const encrypter = Encrypter.fromJSON(json);

      expect(encrypter.method).toBe('METHOD');
      expect(encrypter.params.getString('key1')).toBe('val1');
      expect(encrypter.params.getNumber('key2')).toBe(5);
    });
  });
});
