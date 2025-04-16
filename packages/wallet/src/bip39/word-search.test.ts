import { bip39EnglishSearch } from './word-search';
import { BIP39_ENGLISH_WORDS } from './words';

jest.useFakeTimers();

describe('bip39Search', () => {
  it('returns empty array if query is less than 2 characters', () => {
    const mockCallback = jest.fn();
    bip39EnglishSearch('a', 300, mockCallback);

    jest.advanceTimersByTime(300);

    expect(mockCallback).toHaveBeenCalledWith([]);
  });

  it('returns words that start with query (>= 2 chars)', () => {
    const mockCallback = jest.fn();
    bip39EnglishSearch('ab', 200, mockCallback);

    jest.advanceTimersByTime(200);

    const expected = BIP39_ENGLISH_WORDS.filter(word => word.startsWith('ab')).slice(
      0,
      20 // Fixed line breaks here
    );
    expect(mockCallback).toHaveBeenCalledWith(expected);
  });

  it('returns fuzzy matches if not enough startsWith matches and query >= 3', () => {
    const mockCallback = jest.fn();
    bip39EnglishSearch('acc', 300, mockCallback);

    jest.advanceTimersByTime(300);

    const startsWith = BIP39_ENGLISH_WORDS.filter(w => w.startsWith('acc'));
    const fuzzy = BIP39_ENGLISH_WORDS.filter(w => w.includes('acc'));
    const expected = Array.from(new Set([...startsWith, ...fuzzy])).slice(
      0,
      20 // Fixed line breaks here
    );

    expect(mockCallback).toHaveBeenCalledWith(expected);
  });

  it('respects debounce: only latest call executes', () => {
    const mockCallback = jest.fn();

    bip39EnglishSearch('ab', 300, mockCallback);
    bip39EnglishSearch('abo', 300, mockCallback);

    jest.advanceTimersByTime(300);

    const startsWith = BIP39_ENGLISH_WORDS.filter(w => w.startsWith('abo'));
    const fuzzy = BIP39_ENGLISH_WORDS.filter(w => w.includes('abo'));
    const expected = Array.from(new Set([...startsWith, ...fuzzy])).slice(0, 20);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(expected);
  });
});
