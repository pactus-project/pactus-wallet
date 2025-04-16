import { Params } from './params';

describe('Encrypter Params', () => {
  describe('should handle numbers', () => {
    const p = new Params();

    p.setNumber('k1', 0);
    p.setNumber('k2', 0xff);
    p.setNumber('k3', 0xffffffff);
    p.setNumber('k4', Number.MAX_SAFE_INTEGER);

    expect(p.getNumber('k1')).toBe(0);
    expect(p.getNumber('k2')).toBe(0xff);
    expect(p.getNumber('k3')).toBe(0xffffffff);
    expect(p.getNumber('k4')).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('should handle byte arrays', () => {
    const p = new Params();

    p.setBytes('k1', new Uint8Array([0, 0]));
    p.setBytes('k2', new Uint8Array([0xff, 0xff]));
    p.setBytes('k3', new Uint8Array([]));

    expect(p.getBytes('k1')).toStrictEqual(new Uint8Array([0, 0]));
    expect(p.getBytes('k2')).toStrictEqual(new Uint8Array([0xff, 0xff]));
    expect(p.getBytes('k3')).toStrictEqual(new Uint8Array([]));

    expect(p.getString('k1')).toBe('AAA=');
    expect(p.getString('k2')).toBe('//8=');
    expect(p.getString('k3')).toBe('');
  });

  it('should handle byte strings', () => {
    const p = new Params();

    p.setString('k1', 'foo');
    p.setString('k2', 'bar');
    p.setString('k3', '');
    expect(p.getString('k1')).toBe('foo');
    expect(p.getString('k2')).toBe('bar');
    expect(p.getString('k3')).toBe('');
  });
});
