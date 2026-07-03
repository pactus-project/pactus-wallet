import { fetchAccountTransactions } from './transaction';
import { PACTUSSCAN_API_URL } from '@/config/pactusscan';

describe('fetchAccountTransactions', () => {
  const emptyResponse = { txs: null, total: 0, pages: 0, per_page: 20 };
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => emptyResponse,
    } as Response);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should query the mainnet API by default', async () => {
    await fetchAccountTransactions('pc1z123');

    expect(fetchSpy).toHaveBeenCalledWith(
      `${PACTUSSCAN_API_URL.MAINNET}/api/v1/account/pc1z123/txs?page=1&limit=20`
    );
  });

  it('should query the testnet API when isTestnet is true', async () => {
    await fetchAccountTransactions('tpc1z123', 2, 10, true);

    expect(fetchSpy).toHaveBeenCalledWith(
      `${PACTUSSCAN_API_URL.TESTNET}/api/v1/account/tpc1z123/txs?page=2&limit=10`
    );
  });

  it('should throw when the response is not ok', async () => {
    fetchSpy.mockResolvedValue({ ok: false } as Response);

    await expect(fetchAccountTransactions('pc1z123')).rejects.toThrow(
      'Failed to fetch transactions'
    );
  });
});
