import { WalletCore } from '@trustwallet/wallet-core';
import { HDWallet } from '@trustwallet/wallet-core/dist/src/wallet-core';


export class Wallet {
    private wallet: HDWallet;
    private core: WalletCore;
    private nextEd25519Index: number; // TODO: save inside JSON

    private constructor(core: WalletCore, wallet: HDWallet, password: string) {
        this.core = core;
        this.wallet = wallet;
        this.nextEd25519Index = 0;
    }

    static create(core: WalletCore, entropy: number, password: string): Wallet {
        let wallet = core.HDWallet.create(entropy, "");

        return new Wallet(core, wallet, password)
    }

    static restore(core: WalletCore, mnemonic: string, password: string): Wallet {
        let wallet = core.HDWallet.createWithMnemonic(mnemonic, "");

        return new Wallet(core, wallet, password)
    }


    newEd25519Address(label: string): string {
        const derivationPath = `m/44'/21888'/3'/${this.nextEd25519Index}'`;
        const privateKey = this.wallet.getKey(this.core.CoinType.pactus, derivationPath);
        const address = this.core.CoinTypeExt.deriveAddress(this.core.CoinType.pactus, privateKey);

        this.nextEd25519Index++;

        // TODO: save label in JSON

        return address
    }
}
