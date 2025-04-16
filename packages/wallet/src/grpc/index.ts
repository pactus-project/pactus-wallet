/**
 * gRPC module compatibility layer
 *
 * This file provides access to the gRPC clients from the pactus-grpc package.
 * It includes fallback behavior for environments where gRPC might not be supported.
 */

import * as grpcJs from '@grpc/grpc-js';

let pactusGrpc: any;

try {
  // Import the pactus-grpc package
  pactusGrpc = require('pactus-grpc');
} catch (e) {
  pactusGrpc = {
    wallet_grpc_pb: { WalletClient: class {} },
    blockchain_grpc_pb: { BlockchainClient: class {} },
    transaction_grpc_pb: { TransactionClient: class {} },
    network_grpc_pb: { NetworkClient: class {} },
    utils_grpc_pb: { UtilsClient: class {} },
    wallet_pb: {},
    blockchain_pb: {},
    transaction_pb: {},
    network_pb: {},
    utils_pb: {},
  };
}

// Export the components with the same structure as before
export const wallet = pactusGrpc.wallet_grpc_pb;
export const blockchain = pactusGrpc.blockchain_grpc_pb;
export const transaction = pactusGrpc.transaction_grpc_pb;
export const network = pactusGrpc.network_grpc_pb;
export const utils = pactusGrpc.utils_grpc_pb;

// Export the message classes
export const walletPb = pactusGrpc.wallet_pb;
export const blockchainPb = pactusGrpc.blockchain_pb;
export const transactionPb = pactusGrpc.transaction_pb;
export const networkPb = pactusGrpc.network_pb;
export const utilsPb = pactusGrpc.utils_pb;

// Export the grpc module directly for convenience
export const grpc = grpcJs;
