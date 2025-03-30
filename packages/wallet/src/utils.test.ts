import { encodeBech32WithType, sprintf } from './utils';

describe('sprintf function', () => {
  test.each([
    ['Hello, %s!', ['World'], 'Hello, World!'],
    ['You have %d messages.', [5], 'You have 5 messages.'],
    [
      'User: %s, Age: %d, Score: %d',
      ['Alice', 30, 95],
      'User: Alice, Age: 30, Score: 95',
    ],
    ['No placeholders here.', [], 'No placeholders here.'],
  ])("formats '%s' with args %p to '%s'", (format, args, expected) => {
    expect(sprintf(format, ...args)).toBe(expected);
  });

  describe('public key to string', () => {
    test.each([
      [
        'public',
        'ea67f8aabc74d00682b4a74d5cd149cb769c3216b3bb0d3a1de3f8f9ba554174',
        3,
        'public1rafnl324uwngqdq455ax4e52fedmfcvskkwas6wsau0u0nwj4g96qztd56p',
      ],
      [
        'tpublic',
        'ea67f8aabc74d00682b4a74d5cd149cb769c3216b3bb0d3a1de3f8f9ba554174',
        3,
        'tpublic1rafnl324uwngqdq455ax4e52fedmfcvskkwas6wsau0u0nwj4g96qey5ykc',
      ],
    ])(
      "should encode data with hrp '%s', type %d, and match expected output'",
      (prefix, hex, type, expected) => {
        const data = Buffer.from(hex, 'hex');
        const encoded = encodeBech32WithType(prefix, data, type);

        expect(encoded).toBe(expected);
      }
    );
  });
});
