/**
 * Generate a simple UUID
 * Fallback method when crypto.randomUUID is not available
 * @returns A UUID v4 string
 */
export function generateUUID(): string {
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);

  buffer[6] = (buffer[6] & 0x0f) | 0x40;
  buffer[8] = (buffer[8] & 0x3f) | 0x80;

  return Array.from(buffer, (byte, index) => {
    const hex = byte.toString(16).padStart(2, '0');
    return hex + ([4, 6, 8, 10].includes(index) ? '-' : '');
  })
    .join('')
    .slice(0, 36);
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
