export function castArray<T>(value: T): T[];
export function castArray(): [];
export function castArray<T>(value?: T): T[] | [] {
  if (arguments.length === 0) {
    return [];
  }

  return Array.isArray(value) ? value : [value as T];
}
