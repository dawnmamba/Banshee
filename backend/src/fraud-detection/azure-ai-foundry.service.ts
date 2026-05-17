import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { FRAUD_ANALYSIS_SYSTEM_PROMPT } from './fraud-analysis.constants';
import {
  isAzureModelInferenceEndpoint,
  resolveAzureOpenAiChatConfig,
} from './azure-openai-config';
import type {
  FraudAnalysisPayload,
  FraudAnalysisResultDto,
} from './fraud-detection.types';
import { parseFraudAnalysisResponse } from './parse-fraud-analysis-response';

type ChatCompletionResponseBody = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
    code?: string;
  };
};

@Injectable()
export class AzureAiFoundryService {
  async analyzeFraud(
    payload: FraudAnalysisPayload,
  ): Promise<FraudAnalysisResultDto> {
    const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT?.trim();
    if (!endpoint) {
      throw new ServiceUnavailableException(
        'Azure AI Foundry endpoint is not configured (AZURE_AI_FOUNDRY_ENDPOINT)',
      );
    }

    const messages = [
      { role: 'system' as const, content: FRAUD_ANALYSIS_SYSTEM_PROMPT },
      { role: 'user' as const, content: JSON.stringify(payload) },
    ];

    try {
      const content = isAzureModelInferenceEndpoint(endpoint)
        ? await this.chatViaModelInference(endpoint, messages)
        : await this.chatViaAzureOpenAi(messages);

      return parseFraudAnalysisResponse(content);
    } catch (error) {
      if (
        error instanceof ServiceUnavailableException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('not configured')) {
        throw new ServiceUnavailableException(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'Azure AI Foundry request failed';
      throw new InternalServerErrorException(message);
    }
  }

  private async chatViaAzureOpenAi(
    messages: Array<{ role: 'system' | 'user'; content: string }>,
  ): Promise<string> {
    const { url, apiKey } = resolveAzureOpenAiChatConfig();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature: 0.2,
        max_tokens: 4096,
      }),
    });

    const body = (await response.json()) as ChatCompletionResponseBody;

    if (!response.ok) {
      const message =
        body.error?.message ??
        `Azure OpenAI request failed with status ${response.status}`;
      throw new InternalServerErrorException(message);
    }

    return this.extractContent(body);
  }

  private async chatViaModelInference(
    endpoint: string,
    messages: Array<{ role: 'system' | 'user'; content: string }>,
  ): Promise<string> {
    const apiKey = process.env.AZURE_AI_FOUNDRY_API_KEY?.trim();
    const deployment = process.env.AZURE_AI_FOUNDRY_DEPLOYMENT?.trim();

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Azure AI Foundry API key is not configured (AZURE_AI_FOUNDRY_API_KEY)',
      );
    }
    if (!deployment) {
      throw new ServiceUnavailableException(
        'Azure AI Foundry deployment is not configured (AZURE_AI_FOUNDRY_DEPLOYMENT)',
      );
    }

    const baseEndpoint = endpoint
      .replace(/\/openai\/deployments\/.*$/i, '')
      .replace(/\/$/, '');

    const client = ModelClient(baseEndpoint, new AzureKeyCredential(apiKey));
    const response = await client.path('/chat/completions').post({
      body: {
        model: deployment,
        messages,
        temperature: 0.2,
        max_tokens: 4096,
      },
    });

    if (isUnexpected(response)) {
      const body = response.body as ChatCompletionResponseBody;
      const message =
        body.error?.message ?? 'Azure AI Foundry chat completion failed';
      throw new InternalServerErrorException(message);
    }

    return this.extractContent(response.body);
  }

  private extractContent(body: ChatCompletionResponseBody): string {
    const content = body.choices?.[0]?.message?.content;
    if (!content?.trim()) {
      throw new InternalServerErrorException(
        'Azure AI Foundry returned an empty response',
      );
    }
    return content;
  }
}
