import { Inject, Injectable, Optional } from '@nestjs/common';
import {
  BANKING_API_CONFIG,
  type BankingApiConfig,
} from './banking-api.config';

export class BankingApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'BankingApiError';
  }
}

type FetchFn = typeof fetch;

@Injectable()
export class BankingApiService {
  constructor(
    @Inject(BANKING_API_CONFIG) private readonly config: BankingApiConfig,
    @Optional() @Inject('FETCH') private readonly fetchFn?: FetchFn,
  ) {}

  private get fetch(): FetchFn {
    return this.fetchFn ?? fetch;
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${this.config.baseUrl}${normalizedPath}`;

    const res = await this.fetch(url, {
      ...init,
      headers: {
        'x-api-key': this.config.apiKey,
        ...(init?.headers as Record<string, string> | undefined),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new BankingApiError(text || `HTTP ${res.status}`, res.status);
    }

    return res.json() as Promise<T>;
  }
}
