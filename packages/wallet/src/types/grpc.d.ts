// Type definitions for gRPC generated clients

// Using non-relative module names for ambient declarations
declare module 'grpc/wallet_grpc_pb' {
  export const WalletClient: any;
  export const WalletService: any;
}

declare module 'grpc/blockchain_grpc_pb' {
  export const BlockchainClient: any;
  export const BlockchainService: any;
}

declare module 'grpc/network_grpc_pb' {
  export const NetworkClient: any;
  export const NetworkService: any;
}

declare module 'grpc/transaction_grpc_pb' {
  export const TransactionClient: any;
  export const TransactionService: any;
}

declare module 'grpc/utils_grpc_pb' {
  export const UtilsClient: any;
  export const UtilsService: any;
}
