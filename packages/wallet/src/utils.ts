/**
 * Generate a simple UUID
 * Fallback method when crypto.randomUUID is not available
 * @returns A UUID v4 string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function sprintf(format: string, ...args: any[]): string {
  return format.replace(/%s|%d/g, () => args.shift());
}

/**
 * Counts the number of words in a given mnemonic phrase.
 * @param phrase The mnemonic phrase.
 * @returns The word count.
 */
export function getWordCount(phrase: string): number {
  return phrase.trim().split(/\s+/).length;
}
