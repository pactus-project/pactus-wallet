import { sprintf } from './utils';

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
});
