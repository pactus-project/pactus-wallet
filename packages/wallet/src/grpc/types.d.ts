declare module '*.js' {
  const content: any;
  export = content;
}

declare module './gen/js/blockchain_grpc_pb' {
  export class BlockchainClient {
    constructor(address: string, credentials: any);
    getAccount(request: any, callback: (error: Error | null, response: any) => void): void;
    getBlock(request: any, callback: (error: Error | null, response: any) => void): void;
    getBlockchainInfo(request: any, callback: (error: Error | null, response: any) => void): void;
    getValidator(request: any, callback: (error: Error | null, response: any) => void): void;
    // Add other methods as needed
  }
}

declare module './gen/js/blockchain_pb' {
  export class GetAccountRequest {
    setAddress(address: string): void;
  }

  export class GetAccountResponse {
    getAccount(): AccountInfo | undefined;
  }

  export class AccountInfo {
    getBalance(): number;
    getAddress(): string;
    getNumber(): number;
    getHash(): string;
  }
}

declare module './gen/js/wallet_grpc_pb' {
  export class WalletClient {
    constructor(address: string, credentials: any);
    // Add methods as needed
  }
}

declare module './gen/js/wallet_pb' {
  // Add classes as needed
}

declare module './gen/js/transaction_grpc_pb' {
  export class TransactionClient {
    constructor(address: string, credentials: any);
    // Add methods as needed
  }
}

declare module './gen/js/transaction_pb' {
  // Add classes as needed
}

declare module './gen/js/network_grpc_pb' {
  export class NetworkClient {
    constructor(address: string, credentials: any);
    // Add methods as needed
  }
}

declare module './gen/js/network_pb' {
  // Add classes as needed
}

declare module './gen/js/utils_grpc_pb' {
  export class UtilsClient {
    constructor(address: string, credentials: any);
    // Add methods as needed
  }
}

declare module './gen/js/utils_pb' {
  // Add classes as needed
}
