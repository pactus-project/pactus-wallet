import { Params } from './encrypter/params';

export type WalletID = string;

/**
 * Network type for wallet operation
 */
export enum NetworkType {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

/**
 * Mnemonic Strength options for wallet creation
 * - Normal = 128 bits (12 words)
 * - High = 256 bits (24 words)
 */
export enum MnemonicStrength {
  Normal = 128, // 12 words
  High = 256, // 24 words
}

/**
 * Wallet Information Model
 * Contains user-friendly wallet statistics
 */
export interface WalletInfo {
  type: number; // Wallet type. 1: Full keys, 2: Neutered
  name: string; // User-defined wallet name
  uuid: string; // Unique identifier for this wallet
  creationTime: number; // Timestamp of wallet creation
  network: NetworkType; // Network type: Mainnet or Testnet
}

// Interface for Vault
export interface Vault {
  encrypter: Encrypter; // Encryption algorithm
  keyStore: string; // KeyStore that stores secrets and encrypts using Encrypter
}

// Interface for KeyStore
export interface KeyStore {
  masterNode: MasterNode; // HD Root Tree (Master node)
  importedKeys: string[]; // Imported private keys
}

// Interface for Encrypter
interface Encrypter {
  method: string; // Cipher algorithm method
  params: Params; // Parameters for the cipher algorithm
}

// Interface for MasterNode
interface MasterNode {
  seed: string; // Seed phrase or mnemonic (encrypted)
}

export interface Ledger {
  coinType: number; // Coin type: 21888 for Mainnet, 21777 for Testnet
  purposes: Purposes; // Contains Purpose for generating addresses
  addresses: Map<string, AddressInfo>; // All addresses stored in the wallet
}

// Interface for AddressInfo
export interface AddressInfo {
  address: string; // Address in the wallet
  publicKey: string; // Public key associated with the address
  label: string; // Label for the address
  path: string; // Path for the address
}

// Interface for Purposes
interface Purposes {
  purposeBIP44: PurposeBIP44; // BIP44 Purpose: m/44'/21888'/3'/0'
}

// Interface for PurposeBIP44
interface PurposeBIP44 {
  nextEd25519Index: number; // Index of next Ed25519 derived account: m/44'/21888'/3'/0'
}
