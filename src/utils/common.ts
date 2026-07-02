const PACTUS_PREFIX = 'pactus:';

export function castArray<T>(value: T): T[];
export function castArray(): [];
export function castArray<T>(value?: T): T[] | [] {
  if (arguments.length === 0) {
    return [];
  }

  return Array.isArray(value) ? value : [value as T];
}

export const formatPactusAddress = (address: string): string => {
  if (!address) return '';

  const cleanAddress = address.startsWith(PACTUS_PREFIX)
    ? address.slice(PACTUS_PREFIX.length)
    : address;

  return `${PACTUS_PREFIX}${cleanAddress}`;
};
