/**
 * Interface for the address object within the vault.
 * Contains details about a specific address.
 */
export interface Address {
  /** The address string. */
  address: string;
  /** The public key associated with the address. */
  public_key: string;
  /** A label describing the address. */
  label: string;
  /** The derivation path for the address. */
  path: string;
}

/**
 * Interface for the parameters used in the encrypter.
 * Defines the configuration for the encryption method.
 */
export interface EncrypterParams {
  /** Number of iterations for the encryption algorithm. */
  iterations: string;
  /** Memory size parameter for the encryption algorithm. */
  memory: string;
  /** Parallelism parameter for the encryption algorithm. */
  parallelism: string;
  /** Key length parameter for the encryption algorithm. */
  keylen: string;
}

/**
 * Interface for the encrypter object within the vault.
 * Specifies the encryption method and its parameters.
 */
export interface Encrypter {
  /** The encryption method used. */
  method: string;
  /** Parameters for the encryption method. */
  params: EncrypterParams;
}

/**
 * Interface for the purpose_bip44 object within purposes.
 * Contains information related to BIP44 derivation.
 */
export interface PurposeBip44 {
  /** The next index for Ed25519 keys. */
  next_ed25519_index: number;
}

/**
 * Interface for the purposes object within the vault.
 * Contains purpose-specific configurations.
 */
export interface Purposes {
  /** Configuration for BIP44 purpose. */
  purpose_bip44: PurposeBip44;
}

/**
 * Interface for the vault object.
 * Contains cryptographic and address-related information.
 */
export interface Vault {
  /** The type of the vault. */
  type: number;
  /** The coin type associated with the vault. */
  coin_type: number;
  /** A record of addresses, keyed by their identifier. */
  addresses: Record<string, Address>;
  /** The encrypter configuration for the vault. */
  encrypter: Encrypter;
  /** The encrypted key store. */
  key_store: string;
  /** Purpose-specific configurations. */
  purposes: Purposes;
}

/**
 * Interface for the history object.
 * Contains transaction, activity, and pending data (currently null).
 */
export interface History {
  /** Transaction history (null if not available). */
  transactions: null;
  /** Activity history (null if not available). */
  activities: null;
  /** Pending transactions (null if not available). */
  pendings: null;
}

/**
 * Interface for the main object.
 * Represents the entire JSON structure.
 */
export interface WalletData {
  /** The version of the object. */
  version: number;
  /** A unique identifier for the object. */
  uuid: string;
  /** The creation timestamp of the object. */
  created_at: string;
  /** The network identifier. */
  network: number;
  /** The CRC (Cyclic Redundancy Check) value. */
  crc: number;
  /** The vault containing cryptographic and address data. */
  vault: Vault;
  /** The history of transactions and activities. */
  history: History;
}