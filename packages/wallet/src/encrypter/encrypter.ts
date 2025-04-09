import * as crypto from 'crypto';
import * as argon2 from 'argon2-browser';
import { Params } from './params';

export const ParameterKey = {
  iterations: 'iterations',
  memory: 'memory',
  parallelism: 'parallelism',
} as const;

export const EncryptionMethod = {
  none: '',
  argon2id: 'ARGON2ID',
  aes256ctr: 'AES_256_CTR',
  macv1: 'MACV1',
} as const;

// Default parameter values
export const DefaultParams = {
  iterations: 3,
  memory: 65536, // 64 MiB
  parallelism: 4,
} as const;

export const DefaultMethod = `${EncryptionMethod.argon2id}-${EncryptionMethod.aes256ctr}-${EncryptionMethod.macv1}`;

export class Encrypter {
  method: string;
  params: Params;

  constructor(method: string, params: Params) {
    this.method = method;
    this.params = params;
  }

  static noEncrypter(): Encrypter {
    return new Encrypter(EncryptionMethod.none, new Params());
  }

  static defaultEncrypter(): Encrypter {
    const params = new Params();

    params.setNumber(ParameterKey.iterations, DefaultParams.iterations);
    params.setNumber(ParameterKey.memory, DefaultParams.memory);
    params.setNumber(ParameterKey.parallelism, DefaultParams.parallelism);

    return new Encrypter(DefaultMethod, params);
  }

  // Custom JSON serialization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): Record<string, any> {
    return {
      method: this.method,
      params: this.params.toJSON(),
    };
  }

  // Custom JSON deserialization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Encrypter {
    return new Encrypter(json.method, Params.fromJSON(json.params));
  }

  isEncrypted(): boolean {
    return this.method !== EncryptionMethod.none;
  }

  // Helper to perform Argon2id hashing with parameters from this.params
  private async deriveKeyFromPassword(
    password: string,
    salt: Buffer,
  ): Promise<Buffer> {
    const iterations = this.params.getNumber(ParameterKey.iterations);
    const memory = this.params.getNumber(ParameterKey.memory);
    const parallelism = this.params.getNumber(ParameterKey.parallelism);

    const argon2Hash = await argon2.hash({
      pass: password,
      salt,
      time: iterations,
      mem: memory,
      parallelism,
      hashLen: 48,
      type: argon2.ArgonType.Argon2id,
    });

    return Buffer.from(argon2Hash.hash);
  }

  async encrypt(message: string, password: string): Promise<string> {
    if (this.method === EncryptionMethod.none) {
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

    const cipherKey = derivedByte.subarray(0, 32);
    const iv = derivedByte.subarray(32, 48);
    const cipher = this.aesCrypt(Buffer.from(message), iv, cipherKey);

    // MAC method
    const mac = this.calcMACv1(cipherKey.subarray(16, 32), cipher);
    const data = Buffer.concat([salt, cipher, mac]);

    return data.toString('base64');
  }

  async decrypt(cipherText: string, password: string): Promise<string> {
    if (this.method === EncryptionMethod.none) {
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
      case EncryptionMethod.argon2id: {
        const salt = data.subarray(0, 16);

        passwordHash = await this.deriveKeyFromPassword(password, salt);
        break;
      }

      default:
        throw new Error('Method not supported');
    }

    // Encrypter method
    const cipherKey = passwordHash.subarray(0, 32);
    const iv = passwordHash.subarray(32, 48);
    const cipher = data.subarray(16, data.length - 4);
    let msg: string;

    switch (funcs[1]) {
      case EncryptionMethod.aes256ctr: {
        msg = this.aesCrypt(cipher, iv, cipherKey).toString();
        break;
      }

      default:
        throw new Error('Method not supported');
    }

    // MAC method
    switch (funcs[2]) {
      case EncryptionMethod.macv1: {
        const mac = data.subarray(data.length - 4);
        const calculatedMac = this.calcMACv1(
          cipherKey.subarray(16, 32),
          cipher,
        );

        if (!calculatedMac.equals(mac)) {
          throw new Error('Invalid password');
        }
        break;
      }

      default:
        throw new Error('Method not supported');
    }

    return msg;
  }

  private aesCrypt(
    message: Buffer,
    initVec: Buffer,
    cipherKey: Buffer,
  ): Buffer {
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
