import { Encrypter } from '../encrypter/encrypter';
import { Params } from '../encrypter/params';

/**
 * Mnemonic Strength options for wallet creation
 * - Normal = 128 bits (12 words)
 * - High = 256 bits (24 words)
 */
export enum MnemonicStrength {
  Normal = 128, // 12 words
  High = 256, // 24 words
}

// Interface for KeyStore
export interface KeyStore {
  master_node: MasterNode; // HD Root Tree (Master node)
  imported_keys: string[]; // Imported private keys
}

// Interface for MasterNode
interface MasterNode {
  seed: string; // Seed phrase or mnemonic (encrypted)
}

/**
 * Vault class for encryption and key storage
 */
export class Vault {
  // Encryption algorithm
  public encrypter: Encrypter;

  // KeyStore that stores secrets and encrypts using Encrypter
  public keyStore: string;

  constructor(encrypter: Encrypter, keyStore: string) {
    this.encrypter = encrypter;
    this.keyStore = keyStore;
  }

  // Custom JSON serialization
  toJSON(): string {
    return JSON.stringify({
      encrypter: this.encrypter.toJSON(),
      keyStore: this.keyStore,
    });
  }

  // Custom JSON deserialization
  static fromJSON(jsonString: string): Vault {
    const json = JSON.parse(jsonString);
    const encrypter = Encrypter.fromJSON(json.encrypter);
    const keyStore = json.keyStore;
    return new Vault(encrypter, keyStore);
  }
}
