// English translations
const translations = {
  // Choose Name Wallet
  nameYourWallet: 'Name your Wallet',
  walletNameDescription:
    'Name your wallet to easily identify it using the Pactus wallet. These names are stored locally, and can only be seen by you.',
  walletNamePlaceholder: 'Wallet name',
  finish: 'Finish',
  account1: 'Account 1',
  clickToEdit: 'Click to edit',

  // Common
  next: 'Next',
  back: 'Back',
  cancel: 'Cancel',
  confirm: 'Confirm',
  save: 'Save',
  delete: 'Delete',
  copy: 'Copy',
  copied: 'Copied',
  done: 'Done',
  loading: 'Loading...',
  continue: 'Continue',

  // Authentication
  password: 'Password',
  confirmPassword: 'Confirm Password',
  enterPassword: 'Enter Password',
  createPassword: 'Create Password',
  forgotPassword: 'Forgot Password',

  // Dashboard
  overview: 'Overview',
  activity: 'Activity',
  send: 'Send',
  receive: 'Receive',
  balance: 'Balance',

  // Settings
  settings: 'Settings',
  security: 'Security',
  appearance: 'Appearance',
  about: 'About',
  logout: 'Logout',
  exportWallet: 'Export Wallet',

  // Wallet recovery
  recoverWallet: 'Recover Wallet',
  seedPhrase: 'Seed Phrase',
  enterSeedPhrase: 'Enter your seed phrase',
  keepSeedSafe: 'Keep your seed phrase in a safe place',

  // Transactions
  transactionHistory: 'Transaction History',
  noTransactions: 'No transactions yet',
  amount: 'Amount',
  fee: 'Fee',
  date: 'Date',
  status: 'Status',
  confirmed: 'Confirmed',
  pending: 'Pending',
  failed: 'Failed',
  from: 'From',
  receiver: 'To',
  max: 'Max',
  auto: 'Auto',
  selectOrEnterAddress: 'Select or enter an address',
  transactionSent: 'Sent',
  transactionHash: 'Transaction Hash',
  networkFee: 'Network Fee',
  previewTransaction: 'Send Preview',
  oneDay: '1D',
  oneWeek: '7D',
  all: 'ALL',

  // Error messages
  somethingWentWrong: 'Something went wrong',
  tryAgain: 'Please try again',
  invalidPassword: 'Invalid password',
  invalidSeedPhrase: 'Invalid seed phrase',
  passwordRequirements:
    'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
  passwordsDoNotMatch: 'Confirm password does not match.',
  fetchTransactionFail: 'Failed to fetch transactions. Please try again later.',
  noTransactionFound: 'No transactions found',

  // Success messages
  walletCreated: 'Wallet created successfully',
  walletRestored: 'Wallet restored successfully',

  // Welcome Page
  hello: 'Hello!',
  welcomeTo: 'Welcome to',
  pactusWallet: 'Pactus Wallet',
  openSource: 'Open Source',
  openSourceDescription: 'Pactus Wallet is fully open source, explore and contribute to our code',
  simple: 'Simple',
  simpleDescription: 'Pactus Wallet is designed for everyone, from beginners to advanced users.',
  secure: 'Secure',
  secureDescription:
    'Pactus Wallet is a fully static wallet. There is no server involved and all data including your private keys are stored in your browser.',
  termsAndConditions: 'Terms and Conditions',
  iHaveReadAndAgreed: 'I have read and agreed to the',
  letsStart: "Let's Start",

  // Add Wallet
  addWallet: 'Add Wallet',
  addWalletDescription:
    'Easily create a new wallet or import an existing one to manage your digital assets securely.',
  newWallet: 'New Wallet',
  newWalletDescription: 'Create a brand-new wallet and start your journey with Pactus securely.',
  existingWallet: 'Existing Wallet',
  existingWalletDescription:
    'Restore access to your wallet by securely entering your recovery phrase or importing a backup file.',

  // Master Password
  createMasterPassword: 'Create Master Password',
  masterPasswordDescription:
    'Set a strong password to protect your wallet and keep your funds safe.',
  enterYourPassword: 'Enter your password',
  confirmYourPassword: 'Confirm your password',
  cannotRecoverPassword: 'I understand that Pactus cannot recover this password for me.',
  learnMore: 'Learn more',

  // Recovery Phrase
  writeDownRecoveryPhrase: 'Write Down Your Recovery Phrase',
  recoveryPhraseDescription:
    'Your recovery phrase is the only way to restore access to your wallet if you lose your device. We strongly recommend writing it down on paper and keeping it in a safe place.',
  recoveryPhrase: 'Recovery Phrase',
  writeDownWords:
    'Write down the following {0} words in the correct order and keep them in a safe place.',
  twelveWords: '12 Words',
  twentyFourWords: '24 Words',
  confirmRecoveryPhrase: 'Confirm Recovery Phrase',
  enterMissingWords: 'Enter the missing words in the correct order to verify your backup.',

  // Import Wallet
  importExistingWallet: 'Import Existing Wallet',
  importWalletDescription:
    'Restore access to your wallet by securely entering your 12 or 24-word recovery phrase.',
  language: 'Language',
  englishUs: 'English (US)',
  settingsGeneral: 'Settings / General',
  settingsWalletManager: 'Settings / Wallet Manager',
  general: 'General',
  walletManager: 'Wallet Manager',
  nodeManager: 'Node Manager',
  address: 'Address',
  title: 'Title',
  addAccount: 'Add Account',
  bridge: 'Bridge',
  accountAddress: 'Account Address',
  showPrivateKey: 'Show Private Key',
  toShowPrivateKey:
    'To show the private key, please enter your master password to decrypt your account.',
  publicKey: 'Public Key',
  privateKey: 'Private Key',
  label: 'Label',
  accountName: 'Account Name',
  enterAccountName: 'Enter account name',
  enterPublickey: 'Enter public key (optional)',
  totalBalance: 'Total Balance',
  transactionLoading: 'Processing transaction...',
  checkOnExplorer: 'Check On Explorer',
  showPublicKey: 'Show Public Key',
  copyPrivateKey: 'Copy private key to clipboard',
  copyPublicKey: 'Copy public key to clipboard',
  hdPath: 'HD Path',
  searchByTxHashOrAddress: 'Search by transaction hash or address',
  search: 'Search',
  confirmLogout: 'Logout',
  logoutWarning:
    'Are you sure you want to sign out? This action will remove your wallet from this device. You will need your recovery phrase to recover your wallet.',
  updatePassword: 'Update Wallet Password',
  oldPassword: 'Old Password',
  newPassword: 'New Password',
  bondTransaction: 'Bond Transaction',
  transactionType: 'Transaction Type',
  validatorAddress: 'Validator Address',
  validatorPublicKey: 'Validator Public Key (Optional)',
  validatorPublicKeyNotFound: 'Warning: Validator public key not found, Please enter manually',
  version: 'Version',
  commit: 'Commit',
  settingsAbout: 'Settings / About',
  bridgeToChain: 'Bridge to Chain',
  selectBridgeChain: 'Select destination chain',
  bridgePreview: 'Bridge Preview',
  bridgeTransaction: 'Bridge Transaction',
  enterEvmAddress: 'Enter EVM address',
  evmAddress: 'EVM address',
  mainnet: 'Mainnet',
  testnet: 'Testnet',
  addressOnChain: 'Address on chain',
  addressOn: 'Address on',
};

export default translations;
