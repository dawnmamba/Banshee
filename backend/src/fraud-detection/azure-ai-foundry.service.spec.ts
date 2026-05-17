import {
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AzureAiFoundryService } from './azure-ai-foundry.service';
import type { FraudAnalysisPayload } from './fraud-detection.types';

const mockPost = jest.fn() as jest.MockedFunction<
  (args: {
    body: { model: string; messages: Array<{ role: string }> };
  }) => Promise<{ status: string; body: unknown }>
>;

jest.mock('@azure-rest/ai-inference', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    path: jest.fn(() => ({ post: mockPost })),
  })),
  isUnexpected: (response: { status: string }) => response.status !== '200',
}));

describe('AzureAiFoundryService', () => {
  let service: AzureAiFoundryService;
  const payload: FraudAnalysisPayload = { customers: [] };

  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(async () => {
    process.env = {
      ...originalEnv,
      AZURE_AI_FOUNDRY_ENDPOINT: 'https://example.cognitiveservices.azure.com',
      AZURE_AI_FOUNDRY_API_KEY: 'test-key',
      AZURE_AI_FOUNDRY_DEPLOYMENT: 'gpt-4.1',
      AZURE_AI_FOUNDRY_API_VERSION: '2025-01-01-preview',
    };
    mockPost.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AzureAiFoundryService],
    }).compile();

    service = module.get(AzureAiFoundryService);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('throws ServiceUnavailable when endpoint is missing', async () => {
    delete process.env.AZURE_AI_FOUNDRY_ENDPOINT;

    await expect(service.analyzeFraud(payload)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('calls Azure OpenAI deployment URL via fetch', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  riskLevel: 'low',
                  fraudDetected: false,
                  flaggedCustomers: [],
                  narrative: 'No issues.',
                }),
              },
            },
          ],
        }),
    }) as typeof fetch;

    const result = await service.analyzeFraud(payload);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'api-key': 'test-key',
        }) as Record<string, string>,
      }),
    );
    expect(result.narrative).toBe('No issues.');
  });

  it('parses full portal URL and avoids double /chat/completions path', async () => {
    process.env.AZURE_AI_FOUNDRY_ENDPOINT =
      'https://example.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview';

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  riskLevel: 'low',
                  fraudDetected: false,
                  flaggedCustomers: [],
                  narrative: 'ok',
                }),
              },
            },
          ],
        }),
    }) as typeof fetch;

    await service.analyzeFraud(payload);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview',
      expect.any(Object),
    );
  });

  it('throws InternalServerError when Azure OpenAI returns an error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: { message: 'Resource not found' } }),
    }) as typeof fetch;

    await expect(service.analyzeFraud(payload)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('uses model inference client for services.ai.azure.com endpoints', async () => {
    process.env.AZURE_AI_FOUNDRY_ENDPOINT =
      'https://example.services.ai.azure.com/models';

    mockPost.mockResolvedValue({
      status: '200',
      body: {
        choices: [
          {
            message: {
              content: JSON.stringify({
                riskLevel: 'low',
                fraudDetected: false,
                flaggedCustomers: [],
                narrative: 'No issues.',
              }),
            },
          },
        ],
      },
    });

    const result = await service.analyzeFraud(payload);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(result.narrative).toBe('No issues.');
  });
});
