## [1.0.0](https://github.com/pactus-project/pactus-wallet/compare/v0.5.0...v1.0.0) (2025-08-14)

### Feat

- **web**: adding about tab in setting  ([#212](https://github.com/pactus-project/pactus-wallet/pull/212))
- **web**: responsive for mobile ([#210](https://github.com/pactus-project/pactus-wallet/pull/210))

### Fix

- missing total balance overview section ([#213](https://github.com/pactus-project/pactus-wallet/pull/213))

## v0.5.0 (2025-06-18)

### Feat

- **web**: inline editor ([#201](https://github.com/pactus-project/pactus-wallet/pull/201))
- implement the content of T&C and Recovery Phrase ([#197](https://github.com/pactus-project/pactus-wallet/pull/197))
- **account**: add account activity table ([#177](https://github.com/pactus-project/pactus-wallet/pull/177))
- qr format  ([#195](https://github.com/pactus-project/pactus-wallet/pull/195))
- bridge pac using wrapto ([#194](https://github.com/pactus-project/pactus-wallet/pull/194))
- implement indexdb for storage ([#185](https://github.com/pactus-project/pactus-wallet/pull/185))
- **web**: add branding for qr code address ([#193](https://github.com/pactus-project/pactus-wallet/pull/193))
- encode private key with bech32m ([#192](https://github.com/pactus-project/pactus-wallet/pull/192))
- **core**: implement bond transactions ([#179](https://github.com/pactus-project/pactus-wallet/pull/179))
- **web**: bond transaction ([#180](https://github.com/pactus-project/pactus-wallet/pull/180))
- **sidebar**: add command search component and integrate with sidebar ([#174](https://github.com/pactus-project/pactus-wallet/pull/174))
- **web**: update wallet password ([#175](https://github.com/pactus-project/pactus-wallet/pull/175))
- **dashboard**: add receive modal in overview page ([#173](https://github.com/pactus-project/pactus-wallet/pull/173))
- show term and conditions ([#166](https://github.com/pactus-project/pactus-wallet/pull/166))
- **web**: add buttons show wallet information and fix bug balance ([#162](https://github.com/pactus-project/pactus-wallet/pull/162))
- **web**: show wallet information ([#152](https://github.com/pactus-project/pactus-wallet/pull/152))
- **web**: transfer broadcast ([#151](https://github.com/pactus-project/pactus-wallet/pull/151))
- implement reuse component ([#146](https://github.com/pactus-project/pactus-wallet/pull/146))
- remove wallet name page ([#145](https://github.com/pactus-project/pactus-wallet/pull/145))
- **wallet**: implement broadcast transaction ([#138](https://github.com/pactus-project/pactus-wallet/pull/138))
- **analytics**: simplify GA environment configuration ([#137](https://github.com/pactus-project/pactus-wallet/pull/137))
- **wallet**: support testnet address generation with correct prefix ([#135](https://github.com/pactus-project/pactus-wallet/pull/135))
- implement show address information ([#133](https://github.com/pactus-project/pactus-wallet/pull/133))
- impl get balance in nextjs ([#124](https://github.com/pactus-project/pactus-wallet/pull/124))
- implement design system from figma with complete component refactoring ([#119](https://github.com/pactus-project/pactus-wallet/pull/119))
- show address balance ([#123](https://github.com/pactus-project/pactus-wallet/pull/123))
- implement fetch address wallet balance ([#100](https://github.com/pactus-project/pactus-wallet/pull/100))
- apply latest eslint rules, remove gts in packages wallet  ([#111](https://github.com/pactus-project/pactus-wallet/pull/111))
- add localization support to pactus wallet ([#106](https://github.com/pactus-project/pactus-wallet/pull/106))
- add search bip39 words with support debounce ([#108](https://github.com/pactus-project/pactus-wallet/pull/108))
- wallet recovery feature with enhanced seed phrase import functionality ([#103](https://github.com/pactus-project/pactus-wallet/pull/103))
- **web**: generate new address ([#91](https://github.com/pactus-project/pactus-wallet/pull/91))
- **wallet**: add serialize and deserialize for the Maps Object befor… ([#94](https://github.com/pactus-project/pactus-wallet/pull/94))
- **web**: show account address ([#85](https://github.com/pactus-project/pactus-wallet/pull/85))
- hide un-implemented features ([#84](https://github.com/pactus-project/pactus-wallet/pull/84))
- create address ([#78](https://github.com/pactus-project/pactus-wallet/pull/78))
- **wallet**: store wallet info and ledger ([#74](https://github.com/pactus-project/pactus-wallet/pull/74))
- add wallet management and integrate with pactus-wallet ([#49](https://github.com/pactus-project/pactus-wallet/pull/49))
- **wallet**: add encrypter to encrypty wallet seed phrase ([#19](https://github.com/pactus-project/pactus-wallet/pull/19))
- enhance password validation ([#41](https://github.com/pactus-project/pactus-wallet/pull/41))
- add Lottie animations, gradient borders & dynamic action buttons ([#40](https://github.com/pactus-project/pactus-wallet/pull/40))
- export wallet data as json format ([#34](https://github.com/pactus-project/pactus-wallet/pull/34))
- implement recovery phrase generation and validation using BIP39
- implement Pactus Wallet integration
- **encrypter**: define params for encryption method
- replace old transaction components with new implementations and update import paths
- update import paths from 'scens' to 'scenes'
- enhance TransactionsHistory component with dynamic height and integrate into Activity and Wallet pages
- refactor TransactionsHistory component to use grid layout for improved styling and responsiveness
- add new transaction components and styles, including Send, Receive, and Bridge buttons, and implement TransactionsHistory table
- update emoji for Account 1 in sidebar and header title in wallet page
- enhance sidebar functionality with active route detection and improve layout in activity, dashboard, and wallet pages
- add contributing section to sidebar with new icons and styles
- implement activity page layout with sidebar and header components, and add new icons
- add new icons and enhance sidebar and header components
- enhance wallet functionality with context and sidebar component
- implement the Wallet Protocol for support create new wallet
- update emoji selection in ChooseNameWallet component to use buttons for better accessibility
- add ChooseNameWallet component with emoji selection and styling; update navigation from MasterPassword
- implement password visibility toggle in MasterPassword component; add hide password icon
- add master password component with input fields and icons; update icon exports
- enhance RecoveryPhrase component with navigation and step validation
- derive new address

### Fix

- **web**: fix call api loop ([#200](https://github.com/pactus-project/pactus-wallet/pull/200))
- **web**: keep previous data when fetch fail ([#199](https://github.com/pactus-project/pactus-wallet/pull/199))
- **web**: fix bug confirm password ([#181](https://github.com/pactus-project/pactus-wallet/pull/181))
- **web**: remove validate password on send form and password modal ([#167](https://github.com/pactus-project/pactus-wallet/pull/167))
- muted styling for seed word numbers ([#163](https://github.com/pactus-project/pactus-wallet/pull/163))
- **web**: fix some bug and implement rc-field-form ([#157](https://github.com/pactus-project/pactus-wallet/pull/157))
- **web**: fix modal using react portal ([#155](https://github.com/pactus-project/pactus-wallet/pull/155))
- consistent border UI in all component ([#154](https://github.com/pactus-project/pactus-wallet/pull/154))
- fix ui get start page (use tailwindcss) ([#147](https://github.com/pactus-project/pactus-wallet/pull/147))
- enhance welcome title styling and prevent text wrapping ([#134](https://github.com/pactus-project/pactus-wallet/pull/134))
- use pactus-grpc as client ([#127](https://github.com/pactus-project/pactus-wallet/pull/127))
- use https schema for gRPC client ([#125](https://github.com/pactus-project/pactus-wallet/pull/125))
- ui interaction bugs and implement mnemonic validation ([#109](https://github.com/pactus-project/pactus-wallet/pull/109))
- wallet loading issue in production ([#97](https://github.com/pactus-project/pactus-wallet/pull/97))
- wallet creation issue ([#81](https://github.com/pactus-project/pactus-wallet/pull/81))
- **wallet**: convert public key to string ([#80](https://github.com/pactus-project/pactus-wallet/pull/80))
- **wallet**: fix vault encryption ([#79](https://github.com/pactus-project/pactus-wallet/pull/79))
- update CopyPlugin configuration to change output path for walletCoreWasm ([#67](https://github.com/pactus-project/pactus-wallet/pull/67))
- used yarn link for linking wallet package an wasm ([#64](https://github.com/pactus-project/pactus-wallet/pull/64))
- update the workflow that support package wallet dependency  ([#61](https://github.com/pactus-project/pactus-wallet/pull/61))
- wallet package as a dependency ([#59](https://github.com/pactus-project/pactus-wallet/pull/59))
- change npm to yarn in deploy.yml ([#57](https://github.com/pactus-project/pactus-wallet/pull/57))
- wallet package as a dependency ([#56](https://github.com/pactus-project/pactus-wallet/pull/56))
- enables client-side rendering for restore wallet ([#53](https://github.com/pactus-project/pactus-wallet/pull/53))
- remove npx and turbo ([#33](https://github.com/pactus-project/pactus-wallet/pull/33))
- remove unused ReceivePac component import from Wallet page
- update wallet navigation route in sidebar for account buttons
- refactor the source code and fix comment
- update terms and conditions message in MasterPassword component for clarity
- update recovery phrase instruction to reflect dynamic word count selection
- icons name convation
- name convation of storage
- remove npm cache
- install deps without lock
- replace deploy github pages with manual deploy
- remove stage export
- ignored out path
- commit message
- ignored ide and yarn lock

### Refactor

- move the setting icon to right side ([#176](https://github.com/pactus-project/pactus-wallet/pull/176))
- **header**: move logout to settings ([#172](https://github.com/pactus-project/pactus-wallet/pull/172))
- split define password and move rule to the constants file ([#140](https://github.com/pactus-project/pactus-wallet/pull/140))
- use JSON-RPC instead of gRPC ([#130](https://github.com/pactus-project/pactus-wallet/pull/130))
- **wallet**: ensure consistent JSON save and load ([#95](https://github.com/pactus-project/pactus-wallet/pull/95))
- update class names for recovery phrase components and improve styling
- remove unnecessary whitespace from page components
- remove copy to clipboard button from RecoveryPhrase component
- remove unused import from RecoveryPhrase component
- remove LottiePlayer component and update AddWallet to use dynamic import from react-lottie-player
- update LottiePlayer and GuardProvider to use effect dependencies; optimize AddWallet component with dynamic import
