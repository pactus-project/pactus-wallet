import { WalletCore } from '@trustwallet/wallet-core';
import { HDWallet } from '@trustwallet/wallet-core/dist/src/wallet-core';

// Enum to define mnemonic strength options
export enum MnemonicStrength {
    Normal = 128, // 12 words
    High = 256 // 24 words
}
/**
 * Wallet Data Interface
 * Represents the data structure for a wallet, including mnemonic, addresses, and next Ed25519 index
 */
export interface WalletData {
    mnemonic?: string;
    addresses: Array<{
        path: string;
        address: string;
        label: string;
    }>;
    nextEd25519Index: number;
}

/**
 * Wallet Class
 * Represents a wallet instance with methods for creating, restoring, and managing addresses
 */
export class Wallet {
    private wallet: HDWallet;
    private core: WalletCore;
    private nextEd25519Index: number;
    private addresses: Array<{ path: string; address: string; label: string }> = [];

    private constructor(core: WalletCore, wallet: HDWallet, password: string) {
        this.core = core;
        this.wallet = wallet;
        this.nextEd25519Index = 0;
        this.addresses = [];
    }

    /**
     * Create a new wallet with the specified entropy strength
     * @param core WalletCore instance
     * @param strength Mnemonic strength (128 for 12 words, 256 for 24 words)
     * @param password Password for encryption
     * @returns A new Wallet instance
     */
    static create(
        core: WalletCore,
        strength: MnemonicStrength = MnemonicStrength.Normal,
        password: string
    ): Wallet {
        let wallet = core.HDWallet.create(strength, '');
        return new Wallet(core, wallet, password);
    }

    /**
     * Validate a mnemonic phrase
     * @param mnemonic The mnemonic phrase to validate
     * @returns An object with validity status and error message if invalid
     */
    static validateMnemonic(mnemonic: string): { isValid: boolean; error?: string } {
        try {
            // Check if mnemonic is provided
            if (!mnemonic || mnemonic.trim() === '') {
                return { isValid: false, error: 'Mnemonic phrase is required' };
            }

            // Check word count
            const words = mnemonic.trim().split(/\s+/);
            const wordCount = words.length;

            if (wordCount !== 12 && wordCount !== 24) {
                return {
                    isValid: false,
                    error: `Invalid mnemonic: expected 12 or 24 words, got ${wordCount}`
                };
            }

            // Validate proper BIP-39 words (in a real implementation)
            // For this example, we just check if any word is too short or contains non-alphabet chars
            for (const word of words) {
                if (word.length < 3) {
                    return {
                        isValid: false,
                        error: `Invalid word in mnemonic: "${word}" is too short`
                    };
                }

                if (!/^[a-zA-Z]+$/.test(word)) {
                    return {
                        isValid: false,
                        error: `Invalid word in mnemonic: "${word}" contains non-alphabet characters`
                    };
                }
            }

            return { isValid: true };
        } catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : 'Unknown error validating mnemonic'
            };
        }
    }

    /**
     * Restore a wallet from an existing mnemonic
     * @param core WalletCore instance
     * @param mnemonic Mnemonic phrase (12 or 24 words)
     * @param password Password for encryption
     * @returns A restored Wallet instance
     */
    static restore(core: WalletCore, mnemonic: string, password: string): Wallet {
        // Validate mnemonic
        const validation = Wallet.validateMnemonic(mnemonic);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }

        try {
            let wallet = core.HDWallet.createWithMnemonic(mnemonic, '');
            return new Wallet(core, wallet, password);
        } catch (error) {
            throw new Error(
                `Failed to restore wallet: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    // Get all addresses
    getAddresses(): Array<{ address: string; label: string }> {
        return this.addresses.map(({ address, label }) => ({ address, label }));
    }

    // Get info about this wallet
    getWalletInfo(): { mnemonicWordCount: number; addressCount: number } {
        return {
            mnemonicWordCount: this.getMnemonicWordCount(),
            addressCount: this.addresses.length
        };
    }

    newEd25519Address(label: string): string {
        const derivationPath = `m/44'/21888'/3'/${this.nextEd25519Index}'`;
        const privateKey = this.wallet.getKey(this.core.CoinType.pactus, derivationPath);
        const address = this.core.CoinTypeExt.deriveAddress(this.core.CoinType.pactus, privateKey);

        // Save address info
        this.addresses.push({
            path: derivationPath,
            address,
            label: label || `Address ${this.nextEd25519Index + 1}`
        });

        this.nextEd25519Index++;

        return address;
    }

    // Get wallet mnemonic (should be used carefully, only for backup purposes)
    getMnemonic(): string {
        return this.wallet.mnemonic();
    }

    // Get the word count of the mnemonic
    getMnemonicWordCount(): number {
        const mnemonic = this.wallet.mnemonic();
        return mnemonic.trim().split(/\s+/).length;
    }

    /**
     * Export wallet data for storage
     * @returns WalletData object ready for serialization
     */
    export(): WalletData {
        return {
            mnemonic: this.getMnemonic(),
            addresses: this.addresses,
            nextEd25519Index: this.nextEd25519Index
        };
    }

    /**
     * Import wallet data from storage
     * @param data WalletData object from storage
     */
    import(data: WalletData): void {
        this.nextEd25519Index = data.nextEd25519Index;
        this.addresses = [...data.addresses];
    }
}
