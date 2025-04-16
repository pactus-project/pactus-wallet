// Interface for AddressInfo
export interface AddressInfo {
  address: string; // Address in the wallet
  publicKey: string; // Public key associated with the address
  label: string; // Label for the address
  path: string; // Path for the address
}

// Interface for Purposes
export interface Purposes {
  purposeBIP44: PurposeBIP44; // BIP44 Purpose: m/44'/21888'/3'/0'
}

// Interface for PurposeBIP44
export interface PurposeBIP44 {
  nextEd25519Index: number; // Index of next Ed25519 derived account: m/44'/21888'/3'/0'
}

/**
 * Ledger class for managing coin types, purposes, and addresses
 */
export class Ledger {
  coinType: number; // Coin type: 21888 for Mainnet, 21777 for Testnet

  purposes: Purposes; // Contains Purpose for generating addresses

  addresses: Map<string, AddressInfo>;

  constructor(coinType: number, purposes: Purposes) {
    this.coinType = coinType;
    this.purposes = purposes;
    this.addresses = new Map<string, AddressInfo>();
  }

  /**
   * Serializes the Ledger instance into a JSON string.
   * @returns {string} JSON string representation of the Ledger instance.
   */
  serialize(): string {
    return JSON.stringify({
      coinType: this.coinType,
      purposes: this.purposes,
      addresses: Object.fromEntries(this.addresses),
    });
  }

  /**
   * Deserializes a JSON string into a Ledger instance.
   * @param {string} jsonString - JSON string representing a Ledger instance.
   * @returns {Ledger} A new Ledger instance reconstructed from the JSON string.
   */
  static deserialize(jsonString: string): Ledger {
    const json = JSON.parse(jsonString);
    const ledger = new Ledger(json.coinType, json.purposes);

    ledger.addresses = new Map(Object.entries(json.addresses));

    return ledger;
  }
}
