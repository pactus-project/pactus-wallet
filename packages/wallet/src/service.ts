import { WalletCore } from '@trustwallet/wallet-core';
import { initWasm } from '@trustwallet/wallet-core';
import { Wallet, MnemonicStrength, WalletData, Address, WalletInfo } from './wallet';
import { IStorage, MemoryStorage } from './storage';

/**
 * Storage Factory
 * Creates memory storage instances
 */
class StorageFactory {
    static create(): IStorage {
        return new MemoryStorage();
    }
}

/**
 * Wallet Service Events
 */
export enum WalletEvent {
    Created = 'wallet:created',
    Restored = 'wallet:restored',
    AddressCreated = 'wallet:address_created',
    DataImported = 'wallet:data_imported',
    AddressUpdated = 'wallet:address_updated',
    Error = 'wallet:error'
}

/**
 * Wallet Status
 */
export enum WalletStatus {
    Uninitialized = 'uninitialized',
    Initializing = 'initializing',
    Ready = 'ready',
    Locked = 'locked',
    Error = 'error'
}

/**
 * Wallet Service Configuration
 */
export interface WalletServiceConfig {
    autoInitialize: boolean;
    defaultMnemonicStrength: MnemonicStrength;
    walletStorageKey?: string;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: WalletServiceConfig = {
    autoInitialize: true,
    defaultMnemonicStrength: MnemonicStrength.Normal,
    walletStorageKey: 'pactus_wallet_data'
};

/**
 * Wallet Service
 * Provides a frontend-friendly interface to the wallet functionality
 */
export class WalletService {
    private wallet: Wallet | null = null;
    private core: WalletCore | null = null;
    private storage: IStorage;
    private listeners: Map<WalletEvent, Set<Function>> = new Map();
    private config: WalletServiceConfig;
    private status: WalletStatus = WalletStatus.Uninitialized;

    /**
     * Create a new wallet service
     * @param configOverrides Optional configuration overrides
     */
    constructor(configOverrides: Partial<WalletServiceConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...configOverrides };

        // Initialize memory storage
        this.storage = StorageFactory.create();

        // Auto-initialize if configured
        if (this.config.autoInitialize) {
            this.initialize().catch(error => {
                console.error('Failed to initialize wallet service:', error);
                this.status = WalletStatus.Error;
                this.emit(WalletEvent.Error, error);
            });
        }
    }

    /**
     * Initialize the wallet service
     * @returns Promise that resolves when initialization is complete
     */
    async initialize(): Promise<void> {
        try {
            this.status = WalletStatus.Initializing;
            this.core = await initWasm();
            this.status = WalletStatus.Ready;
        } catch (error) {
            this.status = WalletStatus.Error;
            this.emit(WalletEvent.Error, error);
            throw error;
        }
    }

    /**
     * Get the current wallet status
     * @returns Current wallet status
     */
    getStatus(): WalletStatus {
        return this.status;
    }

    /**
     * Create a new wallet
     * @param password Password for encryption
     * @param strength Mnemonic strength
     * @returns The newly created wallet instance
     */
    async createWallet(
        password: string,
        strength: MnemonicStrength = this.config.defaultMnemonicStrength
    ): Promise<Wallet> {
        if (!this.core) {
            await this.initialize();
        }

        if (!this.core) {
            throw new Error('Wallet core not initialized');
        }

        try {
            this.wallet = Wallet.create(this.core, strength, password);

            this.emit(WalletEvent.Created, this.wallet);
            return this.wallet;
        } catch (error) {
            this.status = WalletStatus.Error;
            this.emit(WalletEvent.Error, error);
            throw error;
        }
    }

    /**
     * Restore a wallet from mnemonic
     * @param mnemonic Recovery phrase
     * @param password Password for encryption
     * @returns The restored wallet instance
     */
    async restoreWallet(mnemonic: string, password: string): Promise<Wallet> {
        if (!this.core) {
            await this.initialize();
        }

        if (!this.core) {
            throw new Error('Wallet core not initialized');
        }

        try {
            this.wallet = Wallet.restore(this.core, mnemonic, password);

            this.emit(WalletEvent.Restored, this.wallet);
            return this.wallet;
        } catch (error) {
            this.status = WalletStatus.Error;
            this.emit(WalletEvent.Error, error);
            throw error;
        }
    }

    /**
     * Create a new address
     * @param label Label for the address
     * @returns The newly created address string
     */
    createAddress(label: string): string {
        if (!this.wallet) {
            throw new Error('No wallet available');
        }

        const address = this.wallet.createAddress(label);
        this.emit(WalletEvent.AddressCreated, address);
        this.saveWalletData();
        return address;
    }

    /**
     * Get all addresses in the wallet
     * @returns Array of addresses
     */
    getAddresses(): Array<Address> {
        if (!this.wallet) {
            return [];
        }

        return this.wallet.getAddresses();
    }

    /**
     * Get wallet information
     * @returns Wallet information or null if no wallet is available
     */
    getWalletInfo(): WalletInfo | null {
        if (!this.wallet) {
            return null;
        }

        return this.wallet.getWalletInfo();
    }

    /**
     * Get recovery phrase
     * @returns Mnemonic phrase or empty string if no wallet is available
     */
    getMnemonic(): string {
        if (!this.wallet) {
            return '';
        }

        return this.wallet.getMnemonic();
    }

    /**
     * Update address label
     * @param address Address to update
     * @param label New label
     * @returns Success status
     */
    updateAddressLabel(address: string, label: string): boolean {
        if (!this.wallet) {
            return false;
        }

        // Find the address in the list
        const addresses = this.wallet.getAddresses();
        const targetAddress = addresses.find(addr => addr.address === address);

        if (!targetAddress) {
            return false;
        }

        // Update the label
        targetAddress.label = label;

        // Save the updated wallet data
        this.saveWalletData();

        // Emit update event
        this.emit(WalletEvent.AddressUpdated, targetAddress);

        return true;
    }

    /**
     * Save wallet data to storage
     * @returns Promise that resolves when data is saved
     */
    async saveWalletData(): Promise<boolean> {
        if (!this.wallet) {
            return false;
        }

        const data = this.wallet.serialize();
        try {
            await this.storage.set(this.config.walletStorageKey || 'pactus_wallet_data', data);
            return true;
        } catch (error) {
            this.emit(WalletEvent.Error, error);
            throw error;
        }
    }

    /**
     * Load wallet data from storage
     * @param password Password to decrypt the wallet
     * @returns Promise that resolves with the wallet instance
     */
    async loadWalletData(password: string): Promise<Wallet | null> {
        if (!this.core) {
            await this.initialize();
        }

        try {
            const data = await this.storage.get(
                this.config.walletStorageKey || 'pactus_wallet_data'
            );
            if (!data) {
                return null;
            }

            this.wallet = Wallet.fromData(this.core!, data as WalletData, password);
            return this.wallet;
        } catch (error) {
            this.emit(WalletEvent.Error, error);
            throw error;
        }
    }

    /**
     * Register an event listener
     * @param event Event to listen for
     * @param callback Callback function
     */
    on(event: WalletEvent, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
    }

    /**
     * Remove an event listener
     * @param event Event to stop listening for
     * @param callback Callback function to remove
     */
    off(event: WalletEvent, callback: Function): void {
        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event)!.delete(callback);
    }

    /**
     * Emit an event
     * @param event Event to emit
     * @param data Event data
     */
    private emit(event: WalletEvent, data?: any): void {
        if (!this.listeners.has(event)) {
            return;
        }
        for (const callback of this.listeners.get(event)!) {
            callback(data);
        }
    }
}
