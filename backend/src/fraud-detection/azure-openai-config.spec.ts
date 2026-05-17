import {
  isAzureModelInferenceEndpoint,
  resolveAzureOpenAiChatConfig,
} from './azure-openai-config';

describe('resolveAzureOpenAiChatConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      AZURE_AI_FOUNDRY_API_KEY: 'test-key',
      AZURE_AI_FOUNDRY_DEPLOYMENT: 'gpt-4.1',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('builds URL from base endpoint and deployment', () => {
    process.env.AZURE_AI_FOUNDRY_ENDPOINT =
      'https://example.cognitiveservices.azure.com';
    process.env.AZURE_AI_FOUNDRY_API_VERSION = '2025-01-01-preview';

    const config = resolveAzureOpenAiChatConfig();

    expect(config.url).toBe(
      'https://example.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview',
    );
    expect(config.apiKey).toBe('test-key');
  });

  it('parses a full portal chat-completions URL', () => {
    process.env.AZURE_AI_FOUNDRY_ENDPOINT =
      'https://example.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview';
    delete process.env.AZURE_AI_FOUNDRY_DEPLOYMENT;

    const config = resolveAzureOpenAiChatConfig();

    expect(config.url).toBe(
      'https://example.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview',
    );
    expect(config.deployment).toBe('gpt-4.1');
  });
});

describe('isAzureModelInferenceEndpoint', () => {
  it('detects Foundry model inference hosts', () => {
    expect(
      isAzureModelInferenceEndpoint(
        'https://my-resource.services.ai.azure.com/models',
      ),
    ).toBe(true);
    expect(
      isAzureModelInferenceEndpoint(
        'https://example.cognitiveservices.azure.com',
      ),
    ).toBe(false);
  });
});
