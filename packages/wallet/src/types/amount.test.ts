import { Amount } from './amount';

describe('Amount class', () => {
  describe('basic functionality', () => {
    test('creates with default zero value', () => {
      const amount = new Amount();
      expect(amount.toString()).toBe('0');
      expect(amount.toPac()).toBe(0);
    });

    test('creates from nanoPAC string', () => {
      const amount = new Amount('1000000000');
      expect(amount.toString()).toBe('1000000000');
      expect(amount.toPac()).toBe(1);
    });

    test('creates from PAC values', () => {
      const onePac = Amount.fromPac(1);
      const halfPac = Amount.fromPac(0.5);

      expect(onePac.toString()).toBe('1000000000');
      expect(halfPac.toString()).toBe('500000000');
    });

    test('formats with different decimal places', () => {
      const amount = Amount.fromPac(1.23456789);

      expect(amount.format()).toBe('1.234567890');
      expect(amount.format(2)).toBe('1.23');
      expect(amount.format(0)).toBe('1');
    });
  });

  describe('operations', () => {
    test('adds two amounts', () => {
      const a = Amount.fromPac(1);
      const b = Amount.fromPac(2.5);

      const sum = a.add(b);
      expect(sum.toPac()).toBe(3.5);
    });

    test('subtracts amounts', () => {
      const a = Amount.fromPac(5);
      const b = Amount.fromPac(2);

      const diff = a.subtract(b);
      expect(diff.toPac()).toBe(3);
    });

    test('compares amounts', () => {
      const small = Amount.fromPac(1);
      const medium = Amount.fromPac(5);
      const large = Amount.fromPac(10);

      expect(medium.greaterThan(small)).toBe(true);
      expect(medium.lessThan(large)).toBe(true);
      expect(medium.equals(Amount.fromPac(5))).toBe(true);
    });
  });

  describe('utility methods', () => {
    test('creates zero amount', () => {
      expect(Amount.zero().toString()).toBe('0');
    });

    test('creates from string representation', () => {
      expect(Amount.fromString('1.5').toPac()).toBe(1.5);
    });
  });
});
