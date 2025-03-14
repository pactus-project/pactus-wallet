import { Encrypter, defaultEncrypter } from '../src/encrypter/encrypter';
import { Params } from '../src/encrypter/params';

describe('Encrypter Tests', () => {
    it('should handle NopeEncrypter', async () => {
        const enc = new Encrypter("", new Params());
        expect(enc.isEncrypted()).toBeFalsy();

        const msg = "foo";
        await expect(enc.encrypt(msg, "should-not-have-password")).rejects.toThrow("Invalid password");

        enc.encrypt(msg, "").then(async (cipher) => {
            await expect(enc.decrypt(cipher, "should-not-have-password")).rejects.toThrow("Invalid password");

            await enc.decrypt(cipher, "").then((decipher) => {
                expect(decipher).toBe(msg);
            });
        });
    });

    it('should handle defaultEncrypter', () => {
        const enc = defaultEncrypter();

        expect(enc.method).toBe("ARGON2ID-AES_256_CTR-MACV1");
        expect(enc.params.getNumber("iterations", 0)).toBe(3);
        expect(enc.params.getNumber("memory", 0)).toBe(65536);
        expect(enc.params.getNumber("parallelism", 0)).toBe(4);
        expect(enc.params.getNumber("keylen", 0)).toBe(48);
        expect(enc.isEncrypted()).toBeTruthy();
    });

    it('should handle encryption and decryption', async () => {
        const enc = defaultEncrypter();

        const msg = "foo";
        const password = "cowboy"

        await expect(enc.encrypt(msg, "")).rejects.toThrow("Invalid password");

        enc.encrypt(msg, password).then(async (cipher) => {
            await expect(enc.decrypt(cipher, "")).rejects.toThrow("Invalid password");
            await expect(enc.decrypt(cipher, "invalid-password")).rejects.toThrow("Invalid password");

            enc.decrypt(cipher, password).then((decipher) => {
                expect(decipher).toBe(msg);
            });
        });
    });
});
