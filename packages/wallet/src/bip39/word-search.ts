import { BIP39_ENGLISH_WORDS } from './words';

const timers = new Map<string, NodeJS.Timeout>();

/**
 * Searches for BIP39 English words that match the given query.
 * The search is debounced to improve performance when the user types.
 * Results are returned via the provided callback function.
 *
 * @param query - The search string to match against the BIP39 words.
 * @param delay - The debounce delay in milliseconds.
 *                This controls how long to wait after the user stops typing
 *                before executing the search.
 * @param callback - A function that will be called with an array of matching words.
 *                   If no matches are found, an empty array will be returned.
 */
export function bip39EnglishSearch(
  query: string,
  delay: number,
  callback: (results: string[]) => void
): void {
  bip39Search(query, delay, callback, BIP39_ENGLISH_WORDS);
}

function bip39Search(
  query: string,
  delay: number,
  callback: (results: string[]) => void,
  words: readonly string[]
): void {
  const key = 'default';

  clearTimeout(timers.get(key));

  timers.set(
    key,
    setTimeout(() => {
      const normalized = query.toLowerCase();

      if (normalized.length < 2) {
        callback([]);
        return;
      }

      const startsWithMatches = words.filter(word =>
        word.startsWith(normalized)
      );

      let results: string[];

      if (normalized.length >= 3 && startsWithMatches.length < 10) {
        const fuzzyMatches = words.filter(word => word.includes(normalized));
        results = Array.from(
          new Set([...startsWithMatches, ...fuzzyMatches])
        ).slice(0, 20);
      } else {
        results = startsWithMatches.slice(0, 20);
      }

      callback(results);
    }, delay)
  );
}
