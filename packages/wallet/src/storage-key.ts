import { WalletID } from './types';

export class StorageKey {
  static walletListKey(): string {
    return 'pactus.wallet.list';
  }

  static walletInfoKey(id: WalletID): string {
    return `pactus.wallet.${id}.info`;
  }

  static walletVaultKey(id: WalletID): string {
    return `pactus.wallet.${id}.vault`;
  }

  static walletLedgerKey(id: WalletID): string {
    return `pactus.wallet.${id}.ledger`;
  }
}
