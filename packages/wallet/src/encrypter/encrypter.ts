import { Params } from './params';
import * as crypto from 'crypto';
import * as argon2 from 'argon2-browser';


const ParameterKey = {
    Iterations: 'iterations',
    Memory: 'memory',
    Parallelism: 'parallelism',
    KeyLength: 'keylen'
} as const;

const EncryptionMethod = {
    None: '',
    Argon2id: 'ARGON2ID',
    AES256CTR: 'AES_256_CTR',
    MACv1: 'MACV1'
} as const;


// Default parameter values
const DefaultParams = {
    Iterations: 3,
    Memory: 65536, // 64 MiB
    Parallelism: 4,
    KeyLength: 48
} as const;


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

        const funcs = this.method.split('-');
        if (funcs.length !== 3) {
            throw new Error('Method not supported');
        }

        // Retrieve parameters from this.params
        const iterations = this.params.getNumber(ParameterKey.Iterations);
        const memory = this.params.getNumber(ParameterKey.Memory);
        const parallelism = this.params.getNumber(ParameterKey.Parallelism);
        const keyLen = this.params.getNumber(ParameterKey.KeyLength);

        try {
            const salt = crypto.randomBytes(16);
            const argon2Hash = await argon2.hash({
                pass: password,
                salt: salt,
                time: iterations, // Use iterations from params
                mem: memory, // Use memory from params
                parallelism: parallelism, // Use parallelism from params
                hashLen: keyLen, // Use keyLen from params
                type: argon2.ArgonType.Argon2id
            });

            const derivedByte = Buffer.from(argon2Hash.hash);
            const cipherKey = derivedByte.subarray(0, 32);
            const iv = derivedByte.subarray(32, keyLen);
            const cipher = this.aesCrypt(Buffer.from(message), iv, cipherKey);

            // MAC method
            const mac = this.calcMACv1(cipherKey.subarray(16, 32), cipher);
            let data = Buffer.concat([salt, cipher, mac]);

            return data.toString('base64');
        } catch (err) {
            console.error('Encryption error:', err);
            throw new Error('Encryption failed');
        }
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

        let dec: string = '';
        let derivedByte: Buffer;
        let cipherKey: Buffer;
        let enc = data.subarray(16, data.length - 4);

        // Password hasher method
        switch (funcs[0]) {
            case EncryptionMethod.Argon2id:
                const salt = data.subarray(0, 16);
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
                derivedByte = Buffer.from(argon2Hash.hash);
                cipherKey = derivedByte.subarray(0, 32);
                console.log('derivedByte', derivedByte);
                console.log('derivedByte len', derivedByte.length);

                break

            default:
                throw new Error('Method not supported');
        }

        // Encrypter method
        switch (funcs[1]) {
            case EncryptionMethod.AES256CTR:
                const iv = derivedByte.subarray(32, 48);
                dec = this.aesCrypt(enc, iv, cipherKey).toString();

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
                    enc
                );
                if (!calculatedMac.equals(mac)) {
                    throw new Error('Invalid password');
                }
                break;

            default:
                throw new Error('Method not supported');
        }

        return dec;
    }

    aesCrypt(message: Buffer, initVec: Buffer, cipherKey: Buffer): Buffer {
        const cipher = crypto.createCipheriv('aes-256-ctr', cipherKey, initVec);
        const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
        return encrypted;
    }

    calcMACv1(...data: Buffer[]): Buffer {
        const hasher = crypto.createHash('sha256');
        data.forEach(d => hasher.update(d));
        return hasher.digest().subarray(0, 4);
    }
}

export function defaultEncrypter(): Encrypter {
    const method = `${EncryptionMethod.Argon2id}-${EncryptionMethod.AES256CTR}-${EncryptionMethod.MACv1}`;

    let encParams = new Params();
    encParams.setNumber(ParameterKey.Iterations, DefaultParams.Iterations);
    encParams.setNumber(ParameterKey.Memory, DefaultParams.Memory);
    encParams.setNumber(ParameterKey.Parallelism, DefaultParams.Parallelism);
    encParams.setNumber(ParameterKey.KeyLength, DefaultParams.KeyLength);

    return new Encrypter(method, encParams);
}
