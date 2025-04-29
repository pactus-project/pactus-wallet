// Mock for localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) =>
      // Need to handle empty string values correctly
      key in store ? store[key] : null
    ),
    setItem: jest.fn((key: string, value: string) => {
      // Handle undefined value which gets converted to string "undefined"
      store[key] = value === undefined ? 'undefined' : value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Mock global window object
Object.defineProperty(global, 'window', {
  value: {
    localStorage: localStorageMock,
  },
  writable: true,
});

// Mock global localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});
