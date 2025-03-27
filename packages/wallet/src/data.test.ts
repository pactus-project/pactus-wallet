// const testData = require('./testdata/wallet_version_3.json');

// import { NetworkType, WalletData } from './data'; // Adjust the import path as necessary
// import { Params } from './encrypter/params';

// describe('Wallet Data Tests', () => {
//   it('should serialize and deserialize WalletData correctly', () => {
//     const walletData: WalletData = {
//       version: '3',
//       uuid: '123e4567-e89b-12d3-a456-426614174000',
//       creationTime: new Date('2023-01-01T00:00:00Z'),
//       crc: 123456,
//       name: 'test',
//       network: NetworkType.Mainnet,
//       vault: {
//         type: 1,
//         coinType: 21888,
//         keyStore: 'keystore',
//         purposes: {
//           purposeBIP44: {
//             nextEd25519Index: 1,
//           },
//         },
//         addresses: new Map([
//           [
//             'address-1',
//             {
//               address: 'address-1',
//               publicKey: 'public_key-1',
//               label: 'Address 1',
//               path: 'path-1',
//             },
//           ],
//         ]),
//         encrypter: {
//           method: 'ENC-METHOD',
//           params: new Params(),
//         },
//       },
//     };

//     const json = JSON.stringify(walletData, (key, value) => {
//       if (value instanceof Map) {
//         return Object.fromEntries(value);
//       }
//       return value;
//     });

//     console.log(json);

//     const parsedWallet = JSON.parse(json, (key, value) => {
//       if (key === 'addresses') {
//         return new Map(Object.entries(value));
//       }
//       return value;
//     });

//     expect(parsedWallet.version).toBe(walletData.version);
//     expect(parsedWallet.uuid).toBe(walletData.uuid);
//     expect(new Date(parsedWallet.creationTime)).toEqual(
//       walletData.creationTime
//     );
//     expect(parsedWallet.crc).toBe(walletData.crc);
//     expect(parsedWallet.vault.type).toBe(walletData.vault.type);
//   });
//   describe('Load Test Data', () => {
//     it('should load test data', () => {
//       const walletData: WalletData = JSON.parse(JSON.stringify(testData));
//       expect(walletData).toBeTruthy();
//       expect(3).toBe(walletData.version);
//       expect('44156117-268a-49f0-a906-400659b7a051').toBe(walletData.uuid);
//       console.log(walletData.creationTime);
//       expect(2024).toEqual(walletData.creationTime.getFullYear());
//       expect(8).toEqual(walletData.creationTime.getMonth());
//       expect(27).toEqual(walletData.creationTime.getDay());
//       expect(16).toEqual(walletData.creationTime.getHours());
//       expect(45).toEqual(walletData.creationTime.getMinutes());
//       expect(8).toEqual(walletData.creationTime.getSeconds());
//       expect(261496310).toBe(walletData.crc);
//     });
//   });
// });
