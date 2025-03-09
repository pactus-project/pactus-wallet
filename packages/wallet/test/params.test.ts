import { Params } from '../src/params';

describe('Encrypter Params', () => {

    describe('should handle numbers', () => {
        const p = new Params();

        p.setNumber('k1', 0);
        p.setNumber('k2', 0xFF);
        p.setNumber('k3', 0xFFFFFFFF);
        p.setNumber('k4', 0xFFFFFFFFFFFFFFFF);

        expect(p.getNumber('k1', 0)).toBe(0);
        expect(p.getNumber('k2', 0)).toBe(0xFF);
        expect(p.getNumber('k3', 0)).toBe(0xFFFFFFFF);
        expect(p.getNumber('k4', 0)).toBe(0xFFFFFFFFFFFFFFFF);
    });

    it('should return default values for non-existent keys', () => {
        const p = new Params();

        expect(p.getNumber('not-exist', 24)).toBe(24);
    });

    it('should handle byte arrays', () => {
        const p = new Params();

        p.setBytes('k1', new Uint8Array([0, 0]));
        p.setBytes('k2', new Uint8Array([0xFF, 0xFF]));
        p.setBytes('k3', new Uint8Array([]));

        expect(p.getBytes('k1')).toStrictEqual(new Uint8Array([0, 0]));
        expect(p.getBytes('k2')).toStrictEqual(new Uint8Array([0xFF, 0xFF]));
        expect(p.getBytes('k3')).toStrictEqual(new Uint8Array([]));

        expect(p.getString('k1')).toBe("AAA=");
        expect(p.getString('k2')).toBe("//8=");
        expect(p.getString('k3')).toBe("");
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
