import { Encrypter } from '../encrypter/encrypter';

/**
 * Mnemonic Strength options for wallet creation
 * - Normal (128 bits): 12 words
 * - High (256 bits): 24 words
 */
export type MnemonicStrength = 128 | 256;

/**
 * Mnemonic strength constants
 */
export const MnemonicValues = {
  NORMAL: 128 as MnemonicStrength, // 12 words
  HIGH: 256 as MnemonicStrength, // 24 words
} as const;

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

  /**
   * Serializes the Vault instance into a JSON string.
   * @returns {string} JSON string representation of the Vault instance.
   */
  serialize(): string {
    return JSON.stringify({
      encrypter: this.encrypter.toJSON(),
      keyStore: this.keyStore,
    });
  }

  /**
   * Deserializes a JSON string into a Vault instance.
   * @param {string} jsonString - JSON string representing a Vault instance.
   * @returns {Vault} A new Vault instance reconstructed from the JSON string.
   */
  static deserialize(jsonString: string): Vault {
    const json = JSON.parse(jsonString);
    const encrypter = Encrypter.fromJSON(json.encrypter);
    const keyStore = json.keyStore;

    return new Vault(encrypter, keyStore);
  }
}
