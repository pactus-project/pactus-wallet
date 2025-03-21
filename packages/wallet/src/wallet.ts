import { WalletCore } from '@trustwallet/wallet-core';
import { HDWallet } from '@trustwallet/wallet-core/dist/src/wallet-core';
import { WalletRestoreError } from './error';
import { WALLET_EMOJIS } from './constants';

/**
 * Network type for wallet operation
 */
export enum NetworkType {
    Mainnet = 'mainnet',
    Testnet = 'testnet'
}

/**
 * Mnemonic Strength options for wallet creation
 * Normal = 128 bits (12 words)
 * High = 256 bits (24 words)
 */
export enum MnemonicStrength {
    Normal = 128, // 12 words
    High = 256 // 24 words
}

/**
 * Address Model
 * Represents a wallet address with its derivation path, public key, and user-defined label
 */
export interface Address {
    path: string; // Derivation path (e.g., m/44'/21888'/3'/0')
    address: string; // The public address string
    label: string; // User-defined label
    publicKey: string; // The public key in hex format
}

/**
 * Wallet Data Model
 * Used for exporting/importing wallet data
 */
export interface WalletData {
    version: string; // Wallet data version
    uuid: string; // Unique identifier for this wallet
    creation_time: number; // Timestamp of wallet creation
    mnemonic?: string; // Optional mnemonic (included only during secure exports)
    addresses: Array<Address>; // List of addresses
    nextEd25519Index: number; // Next index to use for address generation
    network: NetworkType; // Network type (mainnet/testnet)
    name: string; // User-defined wallet name
    emoji?: string; // Emoji representation based on UUID
    keystore?: string; // Keystore data
}

/**
 * Wallet Information Model
 * Contains user-friendly wallet statistics
 */
export interface WalletInfo {
    mnemonicWordCount: number; // Number of words in the recovery phrase
    addressCount: number; // Number of addresses in the wallet
    createdAt?: Date; // When the wallet was created
    network: NetworkType; // Network type (mainnet/testnet)
    name: string; // User-defined wallet name
    emoji?: string; // Emoji representation of the wallet
}

/**
 * Pactus Wallet Implementation
 * Manages cryptographic operations using Trust Wallet Core
 */
export class Wallet {
    private wallet: HDWallet;
    private core: WalletCore;
    private nextEd25519Index: number;
    private addresses: Array<Address> = [];
    private createdAt: Date;
    private network: NetworkType;
    private name: string;
    private keystore?: string;
    private uuid: string;
    private emoji?: string;

    /**
     * Private constructor - use static factory methods instead
     */
    private constructor(
        core: WalletCore,
        wallet: HDWallet,
        password: string,
        network: NetworkType = NetworkType.Mainnet,
        name: string = 'My Wallet'
    ) {
        this.core = core;
        this.wallet = wallet;
        this.nextEd25519Index = 0;
        this.addresses = [];
        this.createdAt = new Date();
        this.network = network;
        this.name = name;
        this.keystore = '';
        this.uuid = crypto.randomUUID();
        this.emoji = this.generateEmojiFromUUID(this.uuid);
    }

    /**
     * Create a new wallet
     * @param core WalletCore instance
     * @param strength Mnemonic strength (security level)
     * @param password Password for wallet encryption
     * @param network Network type (mainnet/testnet)
     * @param name User-defined wallet name
     * @returns A new wallet instance
     */
    static create(
        core: WalletCore,
        strength: MnemonicStrength = MnemonicStrength.Normal,
        password: string,
        network: NetworkType = NetworkType.Mainnet,
        name: string = 'My Wallet'
    ): Wallet {
        const wallet = core.HDWallet.create(strength, '');
        return new Wallet(core, wallet, password, network, name);
    }

    /**
     * Restore a wallet from mnemonic
     * @param core WalletCore instance
     * @param mnemonic Recovery phrase
     * @param password Password for wallet encryption
     * @param network Network type (mainnet/testnet)
     * @param name User-defined wallet name
     * @returns A restored wallet instance
     */
    static restore(
        core: WalletCore,
        mnemonic: string,
        password: string,
        network: NetworkType = NetworkType.Mainnet,
        name: string = 'My Wallet'
    ): Wallet {
        try {
            const wallet = core.HDWallet.createWithMnemonic(mnemonic, '');
            return new Wallet(core, wallet, password, network, name);
        } catch (error) {
            throw new WalletRestoreError(
                `Failed to restore wallet: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * Get all addresses in the wallet
     * @returns Array of addresses with their metadata
     */
    getAddresses(): Array<Address> {
        return [...this.addresses]; // Return a copy to prevent external modification
    }

    /**
     * Get general wallet information
     * @returns WalletInfo object
     */
    getWalletInfo(): WalletInfo {
        return {
            mnemonicWordCount: this.getMnemonicWordCount(),
            addressCount: this.addresses.length,
            createdAt: this.createdAt,
            network: this.network,
            name: this.name,
            emoji: this.emoji
        };
    }

    /**
     * Create a new Ed25519 address
     * @param label User-friendly label for the address
     * @returns The generated address string
     */
    createAddress(label: string): string {
        const derivationPath = `m/44'/21888'/3'/${this.nextEd25519Index}'`;
        const privateKey = this.wallet.getKey(this.core.CoinType.pactus, derivationPath);
        const address = this.core.CoinTypeExt.deriveAddress(this.core.CoinType.pactus, privateKey);

        // Get public key
        const publicKey = privateKey.getPublicKeyCurve25519();
        const publicKeyHex = Buffer.from(publicKey.data()).toString('hex');

        // Save address info
        this.addresses.push({
            path: derivationPath,
            address,
            label: label || `Address ${this.nextEd25519Index + 1}`,
            publicKey: publicKeyHex
        });

        this.nextEd25519Index++;
        return address;
    }

    /**
     * Get the wallet's recovery phrase
     * @warning This should be used carefully, only for backup purposes
     * @returns The mnemonic phrase
     */
    getMnemonic(): string {
        return this.wallet.mnemonic();
    }

    /**
     * Get the number of words in the recovery phrase
     * @returns Word count (12 or 24)
     */
    getMnemonicWordCount(): number {
        const mnemonic = this.wallet.mnemonic();
        return mnemonic.trim().split(/\s+/).length;
    }

    /**
     * Get the network type the wallet is configured for
     * @returns NetworkType (mainnet or testnet)
     */
    getNetworkType(): NetworkType {
        return this.network;
    }

    /**
     * Check if wallet is using testnet
     * @returns true if wallet is using testnet
     */
    isTestnet(): boolean {
        return this.network === NetworkType.Testnet;
    }

    /**
     * Get the wallet's name
     * @returns The wallet's name
     */
    getName(): string {
        return this.name;
    }

    /**
     * Set the wallet's name
     * @param name The new name for the wallet
     */
    setName(name: string): void {
        this.name = name;
    }

    /**
     * Get the wallet's emoji
     * @returns The emoji for the wallet
     */
    getEmoji(): string | undefined {
        return this.emoji;
    }

    /**
     * Set the wallet's emoji
     * @param emoji The new emoji for the wallet
     */
    setEmoji(emoji: string): void {
        this.emoji = emoji;
    }

    /**
     * Export wallet data for storage
     * @returns WalletData object ready for serialization
     */
    export(): WalletData {
        // UUID should be already set during construction
        const uuid = this.uuid;

        return {
            version: '3.0',
            uuid: uuid,
            creation_time: this.createdAt.getTime(),
            mnemonic: this.getMnemonic(),
            addresses: this.addresses,
            nextEd25519Index: this.nextEd25519Index,
            network: this.network,
            name: this.name,
            emoji: this.emoji,
            keystore: this.keystore
        };
    }

    /**
     * Generate an emoji representation based on UUID
     * @param uuid The wallet's UUID
     * @returns An emoji character
     */
    private generateEmojiFromUUID(uuid: string): string {
        // Use the first character's code as index
        return WALLET_EMOJIS[uuid.charCodeAt(0) % WALLET_EMOJIS.length];
    }

    /**
     * Import wallet data from storage
     * @param data WalletData object from storage
     */
    import(data: WalletData): void {
        // Preserve the next index from imported data
        this.nextEd25519Index = data.nextEd25519Index;

        // Clear existing addresses to prevent duplicates
        this.addresses = [];

        // Optionally, import existing addresses if needed
        if (data.addresses && data.addresses.length > 0) {
            // Directly assign the imported addresses
            this.addresses = data.addresses.map(addr => ({
                ...addr,
                // Ensure all required properties are present
                path: addr.path || '',
                address: addr.address || '',
                label: addr.label || '',
                publicKey: addr.publicKey || ''
            }));
        }

        // Update network if provided
        if (data.network) {
            this.network = data.network;
        }

        // Update name if provided
        if (data.name) {
            this.name = data.name;
        }

        // Set UUID and emoji
        if (data.uuid) {
            this.uuid = data.uuid;
            // If emoji is provided, use it. Otherwise, generate it from UUID
            this.emoji = data.emoji || this.generateEmojiFromUUID(data.uuid);
        }
    }
}
