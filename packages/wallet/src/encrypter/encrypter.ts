import { Params } from './params';
import * as crypto from 'crypto';
import * as argon2 from 'argon2-browser';


export const ParameterKey = {
    Iterations: 'iterations',
    Memory: 'memory',
    Parallelism: 'parallelism',
    KeyLength: 'keylen'
} as const;

export const EncryptionMethod = {
    None: '',
    Argon2id: 'ARGON2ID',
    AES256CTR: 'AES_256_CTR',
    MACv1: 'MACV1'
} as const;


// Default parameter values
export const DefaultParams = {
    Iterations: 3,
    Memory: 65536, // 64 MiB
    Parallelism: 4,
    KeyLength: 48
} as const;

export const DefaultMethod = `${EncryptionMethod.Argon2id}-${EncryptionMethod.AES256CTR}-${EncryptionMethod.MACv1}`;

export class Encrypter {
    method: string;
    params: Params;

    constructor(method: string, params: Params) {
        this.method = method;
        this.params = params;
    }

    isEncrypted(): boolean {
        return this.method !== EncryptionMethod.None;
    }

    // Helper to perform Argon2id hashing with parameters from this.params
    private async deriveKeyFromPassword(password: string, salt: Buffer): Promise<Buffer> {
        const iterations = this.params.getNumber(ParameterKey.Iterations);
        const memory = this.params.getNumber(ParameterKey.Memory);
        const parallelism = this.params.getNumber(ParameterKey.Parallelism);
        const keyLen = this.params.getNumber(ParameterKey.KeyLength);

        const argon2Hash = await argon2.hash({
            pass: password,
            salt: salt,
            time: iterations,
            mem: memory,
            parallelism: parallelism,
            hashLen: keyLen,
            type: argon2.ArgonType.Argon2id
        });

        return Buffer.from(argon2Hash.hash);
    }

    async encrypt(message: string, password: string): Promise<string> {
        if (this.method === EncryptionMethod.None) {
            if (password !== '') {
                throw new Error('Invalid password');
            }
            return message;
        }

        if (password === '') {
            throw new Error('Invalid password');
        }

        if (this.method !== DefaultMethod) {
            throw new Error('Method not supported');
        }

        const salt = crypto.randomBytes(16);
        const derivedByte = await this.deriveKeyFromPassword(password, salt);

        const keyLen = this.params.getNumber(ParameterKey.KeyLength);
        const cipherKey = derivedByte.subarray(0, 32);
        const iv = derivedByte.subarray(32, keyLen);
        const cipher = this.aesCrypt(Buffer.from(message), iv, cipherKey);

        // MAC method
        const mac = this.calcMACv1(cipherKey.subarray(16, 32), cipher);
        let data = Buffer.concat([salt, cipher, mac]);

        return data.toString('base64');
    }

    async decrypt(cipherText: string, password: string): Promise<string> {
        if (this.method === EncryptionMethod.None) {
            if (password !== '') {
                throw new Error('Invalid password');
            }
            return cipherText;
        }

        const funcs = this.method.split('-');
        if (funcs.length !== 3) {
            throw new Error('Method not supported');
        }

        const data = Buffer.from(cipherText, 'base64');
        if (data.length < 20) {
            throw new Error('Invalid cipher');
        }

        // Password hasher method
        let passwordHash: Buffer;
        switch (funcs[0]) {
            case EncryptionMethod.Argon2id:
                const salt = data.subarray(0, 16);
                passwordHash = await this.deriveKeyFromPassword(password, salt);
                break;

            default:
                throw new Error('Method not supported');
        }

        // Encrypter method
        const cipherKey = passwordHash.subarray(0, 32);
        const iv = passwordHash.subarray(32, 48);
        const cipher = data.subarray(16, data.length - 4);
        let msg: string;

        switch (funcs[1]) {
            case EncryptionMethod.AES256CTR:
                msg = this.aesCrypt(cipher, iv, cipherKey).toString();

                break;

            default:
                throw new Error('Method not supported');
        }

        // MAC method
        switch (funcs[2]) {
            case EncryptionMethod.MACv1:
                const mac = data.subarray(data.length - 4);
                const calculatedMac = this.calcMACv1(
                    cipherKey.subarray(16, 32),
                    cipher
                );
                if (!calculatedMac.equals(mac)) {
                    throw new Error('Invalid password');
                }
                break;

            default:
                throw new Error('Method not supported');
        }

        return msg;
    }

    private aesCrypt(message: Buffer, initVec: Buffer, cipherKey: Buffer): Buffer {
        const cipher = crypto.createCipheriv('aes-256-ctr', cipherKey, initVec);
        const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
        return encrypted;
    }

    private calcMACv1(...data: Buffer[]): Buffer {
        const hasher = crypto.createHash('sha256');
        data.forEach(d => hasher.update(d));
        return hasher.digest().subarray(0, 4);
    }
}

export function defaultEncrypter(): Encrypter {
    let defaultParams = new Params();
    defaultParams.setNumber(ParameterKey.Iterations, DefaultParams.Iterations);
    defaultParams.setNumber(ParameterKey.Memory, DefaultParams.Memory);
    defaultParams.setNumber(ParameterKey.Parallelism, DefaultParams.Parallelism);
    defaultParams.setNumber(ParameterKey.KeyLength, DefaultParams.KeyLength);

    return new Encrypter(DefaultMethod, defaultParams);
}
