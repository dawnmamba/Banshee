export type AzureOpenAiChatConfig = {
  url: string;
  apiKey: string;
  deployment: string;
};

const DEFAULT_API_VERSION = '2024-10-21';

/** Matches a full chat-completions URL copied from the Azure portal. */
const FULL_CHAT_URL_PATTERN =
  /^(https:\/\/[^/]+)\/openai\/deployments\/([^/]+)\/chat\/completions(?:\?api-version=([^&]+))?/i;

export function resolveAzureOpenAiChatConfig(): AzureOpenAiChatConfig {
  const apiKey = process.env.AZURE_AI_FOUNDRY_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('AZURE_AI_FOUNDRY_API_KEY is not configured');
  }

  let endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT?.trim();
  if (!endpoint) {
    throw new Error('AZURE_AI_FOUNDRY_ENDPOINT is not configured');
  }

  let deployment = process.env.AZURE_AI_FOUNDRY_DEPLOYMENT?.trim();
  let apiVersion =
    process.env.AZURE_AI_FOUNDRY_API_VERSION?.trim() || DEFAULT_API_VERSION;

  const fullUrlMatch = endpoint.match(FULL_CHAT_URL_PATTERN);
  if (fullUrlMatch) {
    endpoint = fullUrlMatch[1];
    deployment = deployment || fullUrlMatch[2];
    if (fullUrlMatch[3]) {
      apiVersion = fullUrlMatch[3];
    }
  }

  endpoint = endpoint.replace(/\/$/, '');

  if (!deployment) {
    throw new Error('AZURE_AI_FOUNDRY_DEPLOYMENT is not configured');
  }

  const url = `${endpoint}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;

  return { url, apiKey, deployment };
}

export function isAzureModelInferenceEndpoint(endpoint: string): boolean {
  return /services\.ai\.azure\.com/i.test(endpoint);
}
