/**
 * gRPC module exports
 *
 * This file provides access to the gRPC clients from the downloaded proto files.
 */

import * as grpcJs from 'grpc-web';

// Import all the generated JS files
import * as blockchain_grpc_pb from './gen/js-web/blockchain_grpc_web_pb';
import * as blockchain_pb from './gen/js-web/blockchain_pb';

import * as wallet_grpc_pb from './gen/js-web/wallet_grpc_web_pb';
import * as wallet_pb from './gen/js-web/wallet_pb';

import * as transaction_grpc_pb from './gen/js-web/transaction_grpc_web_pb';
import * as transaction_pb from './gen/js-web/transaction_pb';

import * as network_grpc_pb from './gen/js-web/network_grpc_web_pb';
import * as network_pb from './gen/js-web/network_pb';

import * as utils_grpc_pb from './gen/js-web/utils_grpc_web_pb';
import * as utils_pb from './gen/js-web/utils_pb';

// Export the gRPC service clients
export const wallet = wallet_grpc_pb;

export const blockchain = blockchain_grpc_pb;
export const transaction = transaction_grpc_pb;
export const network = network_grpc_pb;
export const utils = utils_grpc_pb;

// Export the message classes
export const walletPb = wallet_pb;
export const blockchainPb = blockchain_pb;
export const transactionPb = transaction_pb;
export const networkPb = network_pb;
export const utilsPb = utils_pb;

// Export the grpc module directly for convenience
export const grpc = grpcJs;
