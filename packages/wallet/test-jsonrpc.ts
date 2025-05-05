import { initWasm } from '@trustwallet/wallet-core';
import { MemoryStorage } from './src/storage/memory-storage';
import { TransactionType } from './src/types/transaction';
import { NetworkValues } from './src/types/wallet_info';
import { Wallet } from './src/wallet';

/**
 * Simple test script to validate the JSON-RPC implementation
 */
async function testJsonRpc(): Promise<void> {
  // Test endpoints
  const endpoints = ['https://bootstrap2.pactus.org:8545'];

  // Test cases
  const testCases = [
    {
      name: 'Get account fee',
      method: 'pactus.transaction.calculate_fee',
      params: {
        amount: '1000000000000000000', // 1 PAC
        // eslint-disable-next-line @typescript-eslint/naming-convention
        payload_type: TransactionType.TRANSFER_PAYLOAD, // Hardcoded for transfer transactions
      },
    },
    // {
    //   name: 'Get blockchain info',
    //   method: 'pactus.blockchain.get_blockchain_info',
    //   params: {},
    // },
    {
      name: 'Get account info',
      method: 'pactus.blockchain.get_account',
      params: { address: 'pc1z2r0fmu8sg2ffa0tgrr08gnefcxl2kq7wvquf8z' },
    },
    // {
    //   name: 'Get block height',
    //   method: 'pactus.blockchain.get_block_height',
    //   params: {},
    // },
  ];

  // Test each endpoint with each test case

  try {
    for (const endpoint of endpoints) {
      console.info(`\nTesting endpoint: ${endpoint}`);
      console.info('-'.repeat(50));

      const testMnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon cactus';
      const passphrase = 'test';

      const wallet = await Wallet.restore(
        await initWasm(),
        new MemoryStorage(),
        testMnemonic,
        passphrase,
        NetworkValues.TESTNET
      );

      const ballaces = await wallet.getAddressBalance(
        'tpc1r9279rka2eljslpmd8t9y4lfta8dkfasve47wrs'
      );

      console.info('Ballaces:', ballaces);

      const fee = await wallet.calculateFee(ballaces);

      console.info('Fee:', fee);

      const txHashResult = await wallet.sendTransfer(
        'tpc1r9279rka2eljslpmd8t9y4lfta8dkfasve47wrs',
        'tpc1r2dzh4lrcs9rnl4dlz2ngkq2w5desf9m9rcujfe',
        ballaces,
        fee,
        ''
      );

      console.info('TxHash:', txHashResult);

      // const signedTx = await wallet.signTransaction(rawTx, tx.sender);

      // console.info('SignedTx:', signedTx);

      // const txHash = await wallet.broadcastTransaction(signedTx.signed_raw_transaction);

      // console.info('TxHash:', txHash);

      // for (const test of testCases) {
      //   console.info(`\nTest: ${test.name}`);
      //   console.info(`Method: ${test.method}`);
      //   console.info(`Params: ${JSON.stringify(test.params)}`);

      //   const startTime = Date.now();

      //   const result = await fetchJsonRpcResult(endpoint, test.method, test.params as any);
      //   const endTime = Date.now();

      //   console.info(`Response time: ${endTime - startTime}ms`);

      //   // For large responses, just show a summary
      //   if (test.method === 'pactus.blockchain.get_blockchain_info') {
      //     const blockchainInfo = result as Record<string, unknown>;

      //     console.info('Result summary:', {
      //       lastBlockHeight: blockchainInfo.lastBlockHeight,
      //       lastBlockHash: blockchainInfo.lastBlockHash,
      //       totalAccounts: blockchainInfo.totalAccounts,
      //       totalValidators: blockchainInfo.totalValidators,
      //     });
      //   } else {
      //     console.info('Result:', JSON.stringify(result, null, 2));
      //   }

      //   console.info('✅ Success');
      // }
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// async function testJsonRpc(): Promise<void> {
//   const testMnemonic =
//     'pride shoe window enlist high foster ten orbit praise seminar artefact bike';
//   const passphrase = 'test';

//   const wallet = await Wallet.restore(
//     await initWasm(),
//     new MemoryStorage(),
//     testMnemonic,
//     passphrase,
//     NetworkValues.TESTNET
//   );

//   const ballaces = await wallet.getAddressBalance('tpc1r9279rka2eljslpmd8t9y4lfta8dkfasve47wrs');

//   console.info('Ballaces:', ballaces);

//   const fee = await wallet.calculateFee(ballaces);

//   console.info('Fee:', fee);

//   const tx: TransferTransaction = {
//     sender: 'tpc1r9279rka2eljslpmd8t9y4lfta8dkfasve47wrs',
//     receiver: 'tpc1r2dzh4lrcs9rnl4dlz2ngkq2w5desf9m9rcujfe',
//     amount: ballaces,
//     fee,
//     memo: '',
//   };
//   const rawTx = await wallet.getRawTransferTransaction(tx, passphrase);

//   console.info('RawTx:', rawTx);

//   const signedTx = await wallet.signTransaction(rawTx.raw_transaction, tx.sender);

//   console.info('SignedTx:', signedTx);
// }

// Run the test
testJsonRpc().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
