/**
 * Amount class for handling PAC and NanoPAC conversions
 * Based on the Python SDK implementation but maintaining TypeScript's string-based storage
 */

// Constants
export const NANO_PAC_PER_PAC = 1e9;
export const MAX_NANO_PAC = 42e6 * NANO_PAC_PER_PAC;

/**
 * Amount represents the atomic unit in the Pactus blockchain.
 * Each unit is equal to 1e-9 of a PAC.
 *
 * This class provides a type-safe way to handle amounts while keeping
 * the string-based representation internally for precision.
 */
export class Amount {
  private value: string;

  /**
   * Create a new Amount instance
   * @param value - String or numeric value in nanoPAC
   */
  constructor(value: string | number = '0') {
    this.value = typeof value === 'number' ? value.toString() : value;

    // Validate the value is a valid integer string
    if (!Amount.isValid(this.value)) {
      throw new Error(`Invalid amount: ${value}`);
    }
  }

  /**
   * Get the internal string value
   * @returns Amount value as string (nanoPAC)
   */
  toString(): string {
    return this.value;
  }

  /**
   * Get amount value in PAC units
   * @returns Amount value as number (PAC)
   */
  toPac(): number {
    return Number(this.value) / NANO_PAC_PER_PAC;
  }

  /**
   * Format amount for display with proper decimal places
   * @param decimals Number of decimal places to display (default: 9)
   * @returns Formatted PAC amount string
   */
  format(decimals: number = 9): string {
    const formatted = this.toPac().toFixed(decimals);

    return formatted;
  }

  /**
   * Format amount for display with proper decimal places
   * @param decimals Number of decimal places to display (default: 9)
   * @param includeUnit Whether to include the PAC unit in the output (default: false)
   * @returns Formatted PAC amount string
   */
  formatIncludeUnit(decimals: number = 9): string {
    const formatted = this.toPac().toFixed(decimals);

    return `${formatted} PAC`;
  }

  /**
   * Check if this amount equals another amount
   * @param other Another Amount instance to compare
   * @returns true if amounts are equal
   */
  equals(other: Amount): boolean {
    return this.value === other.value;
  }

  /**
   * Add another amount to this one
   * @param other Amount to add
   * @returns New Amount instance with the sum
   */
  add(other: Amount): Amount {
    const sum = BigInt(this.value) + BigInt(other.value);

    return Amount.fromNanoPac(sum.toString());
  }

  /**
   * Subtract another amount from this one
   * @param other Amount to subtract
   * @returns New Amount instance with the difference
   * @throws Error if result would be negative
   */
  subtract(other: Amount): Amount {
    const value1 = BigInt(this.value);
    const value2 = BigInt(other.value);

    if (value1 < value2) {
      throw new Error('Amount cannot be negative');
    }

    const difference = value1 - value2;

    return Amount.fromNanoPac(difference.toString());
  }

  /**
   * Check if this amount is greater than another
   * @param other Amount to compare
   * @returns true if this amount is greater
   */
  greaterThan(other: Amount): boolean {
    return BigInt(this.value) > BigInt(other.value);
  }

  /**
   * Check if this amount is less than another
   * @param other Amount to compare
   * @returns true if this amount is less
   */
  lessThan(other: Amount): boolean {
    return BigInt(this.value) < BigInt(other.value);
  }

  /**
   * Create an Amount instance from nanoPAC value
   * @param nanoPac Integer value in nanoPAC units
   * @returns New Amount instance
   */
  static fromNanoPac(nanoPac: string | number): Amount {
    return new Amount(nanoPac.toString());
  }

  /**
   * Create an Amount instance from PAC value
   * @param pac Floating point value in PAC units
   * @returns New Amount instance
   * @throws Error if pac is NaN or Infinity
   */
  static fromPac(pac: number): Amount {
    if (!Number.isFinite(pac)) {
      throw new Error(`Invalid PAC amount: ${pac}`);
    }

    // Convert PAC to nanoPAC with proper rounding
    const nanoPac = Math.round(pac * NANO_PAC_PER_PAC);

    return Amount.fromNanoPac(nanoPac);
  }

  /**
   * Create an Amount instance from a string representing PAC value
   * @param pacStr String representation of PAC amount
   * @returns New Amount instance
   * @throws Error if string cannot be parsed as a number
   */
  static fromString(pacStr: string): Amount {
    const pac = Number(pacStr);

    if (Number.isNaN(pac)) {
      throw new Error('Invalid PAC amount');
    }

    return Amount.fromPac(pac);
  }

  /**
   * Check if a string or number is a valid amount
   * @param amount Value to validate
   * @returns true if valid, false otherwise
   */
  static isValid(amount: string | number): boolean {
    const amountStr = amount.toString();
    const nanoPac = Number(amountStr);

    return Number.isInteger(nanoPac) && nanoPac >= 0 && nanoPac <= MAX_NANO_PAC;
  }

  /**
   * Create an Amount instance with zero value
   * @returns New Amount instance with zero value
   */
  static zero(): Amount {
    return new Amount('0');
  }
}
