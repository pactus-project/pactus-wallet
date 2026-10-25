import { formatNanoToPac, getMaxSendAmount, parsePacToNano } from './amount';

describe('parsePacToNano', () => {
  it('should parse whole and fractional PAC amounts', () => {
    expect(parsePacToNano('1')).toBe(1_000_000_000n);
    expect(parsePacToNano('0.01')).toBe(10_000_000n);
    expect(parsePacToNano('.5')).toBe(500_000_000n);
    expect(parsePacToNano('12.')).toBe(12_000_000_000n);
    expect(parsePacToNano('0.000000001')).toBe(1n);
  });

  it('should round up digits beyond nanoPAC precision', () => {
    expect(parsePacToNano('0.0000000011')).toBe(2n);
    expect(parsePacToNano('0.0000000010')).toBe(1n);
  });

  it('should return null for invalid input', () => {
    expect(parsePacToNano('')).toBeNull();
    expect(parsePacToNano('.')).toBeNull();
    expect(parsePacToNano('abc')).toBeNull();
    expect(parsePacToNano('-1')).toBeNull();
    expect(parsePacToNano('1e3')).toBeNull();
  });
});

describe('formatNanoToPac', () => {
  it('should format nanoPAC without trailing zeros', () => {
    expect(formatNanoToPac(0n)).toBe('0');
    expect(formatNanoToPac(1_000_000_000n)).toBe('1');
    expect(formatNanoToPac(12_500_000_000n)).toBe('12.5');
    expect(formatNanoToPac(1n)).toBe('0.000000001');
  });
});

describe('getMaxSendAmount', () => {
  it('should never round the amount above the balance', () => {
    // Balance 123.263698 PAC and fee 0.01 PAC leave 123.253698 PAC.
    // The old toFixed(5) logic produced "123.25370", which is more than that.
    const balance = parsePacToNano('123.263698') as bigint;
    const fee = parsePacToNano('0.01') as bigint;

    expect(getMaxSendAmount(balance, fee)).toBe('123.253698');
  });

  it('should keep full nanoPAC precision', () => {
    expect(getMaxSendAmount(1_234_567_891n, 10_000_000n)).toBe('1.224567891');
  });

  it('should return zero when the balance does not cover the fee', () => {
    expect(getMaxSendAmount(5_000_000n, 10_000_000n)).toBe('0');
  });

  it('should handle balances above the safe integer range', () => {
    // 42 million PAC in nanoPAC is larger than Number.MAX_SAFE_INTEGER.
    const balance = 42_000_000_000_000_001n;

    expect(getMaxSendAmount(balance, 10_000_000n)).toBe('41999999.990000001');
  });
});
