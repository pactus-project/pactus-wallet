declare module '*.js' {
  const content: any;
  export = content;
}

declare module './gen/js-web/blockchain_grpc_web_pb' {
  const proto: {
    pactus: {
      BlockchainClient: {
        prototype: any;
        new (hostname: string, credentials: any, options?: object): any;
      };
      BlockchainPromiseClient: {
        prototype: any;
        new (hostname: string, credentials: any, options?: object): any;
      };
    };
  };
  export = proto;
}

declare module './gen/js-web/blockchain_pb' {
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

declare module './gen/js-web/wallet_grpc_web_pb' {
  export class WalletClient {
    constructor(address: string, credentials: any);
    // Add methods as needed
  }
}

declare module './gen/js-web/wallet_pb' {
  // Add classes as needed
}

declare module './gen/js-web/transaction_grpc_web_pb' {
  export class TransactionClient {
    constructor(address: string, credentials: any);
    // Add methods as needed
  }
}

declare module './gen/js-web/transaction_pb' {
  // Add classes as needed
}

declare module './gen/js-web/network_grpc_web_pb' {
  export class NetworkClient {
    constructor(address: string, credentials: any);
    // Add methods as needed
  }
}

declare module './gen/js-web/network_pb' {
  // Add classes as needed
}

declare module './gen/js-web/utils_grpc_web_pb' {
  export class UtilsClient {
    constructor(address: string, credentials: any);
    // Add methods as needed
  }
}

declare module './gen/js-web/utils_pb' {
  // Add classes as needed
}
