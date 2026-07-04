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

// Middle-truncate a long address for narrow (mobile) layouts, e.g.
// tpc1r7aq...9k2p3q. Keeps the head and tail so it stays recognizable.
export const truncateAddress = (address: string, head = 10, tail = 6): string => {
  if (!address || address.length <= head + tail + 1) return address;

  return `${address.slice(0, head)}...${address.slice(-tail)}`;
};
