export type WalletID = string;

/**
 * Network type for wallet operation
 */
export enum NetworkType {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

/**
 * Wallet Information Model
 * Contains user-friendly wallet statistics
 */
export class WalletInfo {
  type: number; // Wallet type. 1: Full keys, 2: Neutered
  name: string; // User-defined wallet name
  uuid: string; // Unique identifier for this wallet
  creationTime: number; // Timestamp of wallet creation
  network: NetworkType; // Network type: Mainnet or Testnet

  constructor(
    type: number,
    name: string,
    uuid: string,
    creationTime: number,
    network: NetworkType
  ) {
    this.type = type;
    this.name = name;
    this.uuid = uuid;
    this.creationTime = creationTime;
    this.network = network;
  }

  /**
   * Serializes the Wallet Info instance into a JSON string.
   * @returns {string} JSON string representation of the Wallet Info instance.
   */
  serialize(): string {
    return JSON.stringify({
      type: this.type,
      name: this.name,
      uuid: this.uuid,
      creationTime: this.creationTime,
      network: this.network,
    });
  }

  /**
   * Deserializes a JSON string into a Wallet Info instance.
   * @param {string} jsonString - JSON string representing a Wallet Info instance.
   * @returns {Wallet Info} A new Wallet Info instance reconstructed from the JSON string.
   */
  static deserialize(jsonString: string): WalletInfo {
    const json = JSON.parse(jsonString);
    return new WalletInfo(
      json.type,
      json.name,
      json.uuid,
      json.creationTime,
      json.network as NetworkType
    );
  }
}
