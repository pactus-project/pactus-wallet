import { WalletID } from './types/wallet_info';

export class StorageKey {
  static walletListKey(): string {
    return 'pactus.wallet.list:v1';
  }

  static walletInfoKey(id: WalletID): string {
    return `pactus.wallet.${id}.info:v1`;
  }

  static walletVaultKey(id: WalletID): string {
    return `pactus.wallet.${id}.vault:v1`;
  }

  static walletLedgerKey(id: WalletID): string {
    return `pactus.wallet.${id}.ledger:v1`;
  }
}
