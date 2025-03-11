import { Params } from './params';


interface Argon2dParameters {
    iterations: number;
    memory: number;
    parallelism: number;
    keyLen: number;
}

type Option = (p: Argon2dParameters) => void;

const nameParamIterations = "iterations";
const nameParamMemory = "memory";
const nameParamParallelism = "parallelism";
const nameParamKeylen = "keylen";

const nameFuncNope = "";
const nameFuncArgon2ID = "ARGON2ID";
const nameFuncAES256CTR = "AES_256_CTR";
const nameFuncAES256CBC = "AES_256_CBC";
const nameFuncMACv1 = "MACV1";

const defaultIterations = 3
const defaultMemory = 65536
const defaultParallelism = 4
const defaultKeyLen = 48

export class Encrypter {
    method: string;
    params: Params;

    constructor(method: string, params: Params) {
        this.method = method;
        this.params = params;
    }

    isEncrypted(): boolean {
        return this.method !== nameFuncNope;
    }

    encrypt(message: string, password: string): string {
        if (this.method === nameFuncNope) {
            if (password !== "") {
                throw new Error("Invalid password");
            }
            return message;
        }

        if (password === "") {
            throw new Error("Invalid password");
        }

        const funcs = this.method.split("-");
        if (funcs.length !== 3) {
            throw new Error("Method not supported");
        }

        try {
            const salt = bcrypt.genSaltSync(16);
            const derivedByte = ...;


            // Encrypter method
            const cipherKey = derivedByte.subarray(0, 32);
            const iv = derivedByte.subarray(32, 48);
            const cipher = this.aesCrypt(Buffer.from(message), iv, cipherKey);

            // MAC method
            const mac = this.calcMACv1(cipherKey.subarray(16, 32), cipher);
            let data = Buffer.concat([salt, cipher, mac]);

            this.method = `${nameFuncArgon2ID}-${nameFuncAES256CTR}-${nameFuncMACv1}`;
            return data.toString('base64');

        } catch (err) {
            console.error("Encryption error:", err);

            throw new Error("Encryption failed");
        }

    }

    async decrypt(cipherText: string, password: string): Promise<string> {
        if (this.method === nameFuncNope) {
            if (password !== "") {
                throw new Error("Invalid password");
            }
            return cipherText;
        }

        const funcs = this.method.split("-");
        if (funcs.length !== 3) {
            throw new Error("Method not supported");
        }

        const data = Buffer.from(cipherText, 'base64');

        if (data.length < 20) {
            throw new Error("Invalid cipher");
        }

        let text: string = "";

        // Password hasher method
        switch (funcs[0]) {
            case nameFuncArgon2ID:
                const salt = data.subarray(0, 16);
                const iterations = this.params.getNumber(nameParamIterations, defaultIterations);
                const memory = this.params.getNumber(nameParamMemory, defaultMemory);
                const parallelism = this.params.getNumber(nameParamParallelism, defaultParallelism);
                const keyLen = this.params.getNumber(nameParamKeylen, defaultKeyLen);

                const argon2Hash = await argon2.hash({
                    pass: password,
                    salt: salt,
                    parallelism: parallelism,
                    mem: memory,
                    time: iterations,
                    hashLen: keyLen,
                    type: argon2.ArgonType.Argon2id,
                });
                const derivedByte = Buffer.from(argon2Hash.hash)
                console.log("derivedByte", derivedByte);
                console.log("derivedByte len", derivedByte.length);

                // Encrypter method
                switch (funcs[1]) {
                    case nameFuncAES256CTR:
                        const cipherKey = derivedByte.subarray(0, 32)
                        const iv = derivedByte.subarray(32, derivedByte.length)

                        const enc = data.subarray(16, data.length - 4);
                        text = this.aesCrypt(enc, iv, cipherKey).toString();

                        // MAC method
                        switch (funcs[2]) {
                            case nameFuncMACv1:
                                const mac = data.subarray(data.length - 4);
                                const calculatedMac = this.calcMACv1(cipherKey.subarray(16, 32), enc);
                                if (!calculatedMac.equals(mac)) {
                                    throw new Error("Invalid password");
                                }
                                break;
                            default:
                                throw new Error("Method not supported");
                        }
                        break;
                    default:
                        throw new Error("Method not supported");
                }
                break;
            default:
                throw new Error("Method not supported");
        }

        return text;
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
    const argon2dParameters: Argon2dParameters = {
        iterations: defaultIterations,
        memory: defaultMemory,
        parallelism: defaultParallelism,
        keyLen: defaultKeyLen,
    };

    const method = `${nameFuncArgon2ID}-${nameFuncAES256CTR}-${nameFuncMACv1}`;

    let encParams = new Params();
    encParams.setNumber(nameParamIterations, argon2dParameters.iterations);
    encParams.setNumber(nameParamMemory, argon2dParameters.memory);
    encParams.setNumber(nameParamParallelism, argon2dParameters.parallelism);
    encParams.setNumber(nameParamKeylen, argon2dParameters.keyLen);

    return new Encrypter(method, encParams);
}
