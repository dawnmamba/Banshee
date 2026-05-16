import { Test, TestingModule } from '@nestjs/testing';
import { BankingApiError, BankingApiService } from './banking-api.service';
import { BANKING_API_CONFIG } from './banking-api.config';

describe('BankingApiService', () => {
  let service: BankingApiService;
  const fetchMock = jest.fn();

  beforeEach(async () => {
    fetchMock.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankingApiService,
        {
          provide: BANKING_API_CONFIG,
          useValue: {
            baseUrl: 'http://bank.example:3000',
            apiKey: 'test-api-key',
          },
        },
        { provide: 'FETCH', useValue: fetchMock },
      ],
    }).compile();

    service = module.get(BankingApiService);
  });

  it('request() prefixes base URL and sends x-api-key', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    await service.request('/foo/bar');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [
      string,
      { headers: Record<string, string> },
    ];
    expect(url).toBe('http://bank.example:3000/foo/bar');
    expect(init.headers['x-api-key']).toBe('test-api-key');
  });

  it('request() throws BankingApiError on non-OK HTTP', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      text: () => Promise.resolve('unavailable'),
    });

    await expect(service.request('/down')).rejects.toBeInstanceOf(
      BankingApiError,
    );
  });

  it('request() extracts Status.Message from JSON error bodies', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            FundsTransfer_Response: {
              Status: {
                Code: '9040',
                Message: 'Account not authorized for your subscription',
              },
            },
          }),
        ),
    });

    await expect(service.request('/forbidden')).rejects.toMatchObject({
      message: 'Account not authorized for your subscription',
      status: 403,
    });
  });
});
