const NANO_PAC_DECIMALS = 9;
const NANO_PAC_PER_PAC = 10n ** BigInt(NANO_PAC_DECIMALS);

/**
 * Parses a PAC amount string (for example "0.01") into nanoPAC without
 * floating point math. Digits beyond nanoPAC precision round up, so a fee
 * parsed here is never smaller than the fee that is actually paid.
 *
 * @param value - PAC amount as typed by the user
 * @returns The amount in nanoPAC, or null when the string is not a valid amount
 */
export const parsePacToNano = (value: string): bigint | null => {
  const match = /^\s*(\d*)(?:\.(\d*))?\s*$/.exec(value);
  if (!match) {
    return null;
  }

  const [, whole = '', fraction = ''] = match;
  if (whole === '' && fraction === '') {
    return null;
  }

  const kept = fraction.slice(0, NANO_PAC_DECIMALS).padEnd(NANO_PAC_DECIMALS, '0');
  const dropped = fraction.slice(NANO_PAC_DECIMALS);
  const roundUp = /[1-9]/.test(dropped) ? 1n : 0n;

  return BigInt(whole || '0') * NANO_PAC_PER_PAC + BigInt(kept) + roundUp;
};

/**
 * Formats nanoPAC as an exact PAC string, without trailing zeros.
 *
 * @param nano - Amount in nanoPAC
 * @returns PAC amount, for example "12.5" or "0.000000001"
 */
export const formatNanoToPac = (nano: bigint): string => {
  const sign = nano < 0n ? '-' : '';
  const abs = nano < 0n ? -nano : nano;
  const whole = abs / NANO_PAC_PER_PAC;
  const fraction = (abs % NANO_PAC_PER_PAC)
    .toString()
    .padStart(NANO_PAC_DECIMALS, '0')
    .replace(/0+$/, '');

  return fraction ? `${sign}${whole}.${fraction}` : `${sign}${whole}`;
};

/**
 * Returns the largest amount that can be sent after paying the fee. The result
 * is exact to the nanoPAC, so amount plus fee never exceeds the balance.
 *
 * @param balanceNano - Account balance in nanoPAC
 * @param feeNano - Transaction fee in nanoPAC
 * @returns PAC amount string, "0" when the balance does not cover the fee
 */
export const getMaxSendAmount = (balanceNano: bigint, feeNano: bigint): string => {
  const max = balanceNano - feeNano;

  return formatNanoToPac(max > 0n ? max : 0n);
};
