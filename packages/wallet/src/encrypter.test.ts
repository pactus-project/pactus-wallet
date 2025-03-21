import { Encrypter, defaultEncrypter } from '../src/encrypter/encrypter';
import { Params } from '../src/encrypter/params';

describe('Encrypter Tests', () => {
    it('should handle NopeEncrypter', async () => {
        // Create an Encrypter with no encryption method
        const enc = new Encrypter("", new Params());
        expect(enc.isEncrypted()).toBeFalsy();

        const msg = "foo";

        // Trying to encrypt with a non-empty password should fail
        await expect(enc.encrypt(msg, "should-not-have-password")).rejects.toThrow("Invalid password");

        // Encrypt with empty password
        const cipher = await enc.encrypt(msg, "");

        // Trying to decrypt with non-empty password should fail
        await expect(enc.decrypt(cipher, "should-not-have-password")).rejects.toThrow("Invalid password");

        // Decrypt with empty password should succeed
        const decipher = await enc.decrypt(cipher, "");
        expect(decipher).toBe(msg);
    });

    it('should handle defaultEncrypter', () => {
        // Get the default Encrypter with Argon2id, AES-256-CTR, MACv1
        const enc = defaultEncrypter();

        expect(enc.method).toBe("ARGON2ID-AES_256_CTR-MACV1");
        expect(enc.params.getNumber("iterations")).toBe(3);
        expect(enc.params.getNumber("memory")).toBe(65536);
        expect(enc.params.getNumber("parallelism")).toBe(4);
        expect(enc.params.getNumber("keylen")).toBe(48);
        expect(enc.isEncrypted()).toBeTruthy();
    });

    it('should handle encryption and decryption', async () => {
        // Get the default Encrypter
        const enc = defaultEncrypter();
        const msg = "foo";
        const password = "cowboy";

        // Trying to encrypt with empty password should fail
        await expect(enc.encrypt(msg, "")).rejects.toThrow("Invalid password");

        // Encrypt with correct password
        const cipher = await enc.encrypt(msg, password);

        // Trying to decrypt with empty password should fail
        await expect(enc.decrypt(cipher, "")).rejects.toThrow("Invalid password");

        // Trying to decrypt with wrong password should fail
        await expect(enc.decrypt(cipher, "invalid-password")).rejects.toThrow("Invalid password");

        // Decrypt with correct password should succeed
        const decipher = await enc.decrypt(cipher, password);
        expect(decipher).toBe(msg);
    });
});
