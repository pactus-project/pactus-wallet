export class Params {
  private data: Map<string, string>;

  constructor() {
    this.data = new Map<string, string>();
  }

  setNumber(key: string, val: number): void {
    // Convert number to string and store
    this.data.set(key, val.toString());
  }

  setBytes(key: string, val: Uint8Array): void {
    // Convert Uint8Array to base64 string and store
    const base64 = Buffer.from(val).toString('base64');
    this.data.set(key, base64);
  }

  setString(key: string, val: string): void {
    // Store string directly
    this.data.set(key, val);
  }

  getNumber(key: string): number {
    const val = this.data.get(key);
    if (val === undefined) throw new Error(`Key "${key}" not found`);

    // Parse string back to number
    return parseInt(val, 10);
  }

  getBytes(key: string): Uint8Array {
    const val = this.data.get(key);
    if (val === undefined) {
      throw new Error(`Key "${key}" not found`);
    }

    // Convert base64 string back to Uint8Array
    return new Uint8Array(Buffer.from(val, 'base64'));
  }

  getString(key: string): string {
    const val = this.data.get(key);
    if (val === undefined) {
      throw new Error(`Key "${key}" not found`);
    }

    return val;
  }
}
