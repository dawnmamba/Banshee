import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  FraudAnalysisPayload,
  FraudAnalysisResultDto,
} from './fraud-detection.types';

const DEFAULT_MODEL = 'gemini-2.0-flash';

const SYSTEM_PROMPT = `You are a bank fraud analyst. Review imported customer and transaction JSON.
Respond with ONLY valid JSON (no markdown fences) matching this schema:
{
  "riskLevel": "low" | "medium" | "high",
  "fraudDetected": boolean,
  "flaggedCustomers": [{ "customerId": string, "reason": string }],
  "narrative": string
}
Flag customers with suspicious patterns (velocity, round amounts, unusual credits, etc.).
If nothing suspicious, fraudDetected false and empty flaggedCustomers.`;

@Injectable()
export class GeminiService {
  async analyzeFraud(
    payload: FraudAnalysisPayload,
  ): Promise<FraudAnalysisResultDto> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Gemini API key is not configured (GEMINI_API_KEY)',
      );
    }

    const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: JSON.stringify(payload) },
      ]);
      const text = result.response.text();
      return this.parseModelResponse(text);
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Gemini request failed';
      throw new InternalServerErrorException(message);
    }
  }

  parseModelResponse(text: string): FraudAnalysisResultDto {
    const trimmed = text.trim();
    const jsonText = trimmed.startsWith('```')
      ? trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
      : trimmed;

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new InternalServerErrorException(
        'Gemini returned an invalid JSON response',
      );
    }

    return this.normalizeResult(parsed);
  }

  normalizeResult(value: unknown): FraudAnalysisResultDto {
    if (!value || typeof value !== 'object') {
      throw new InternalServerErrorException(
        'Gemini returned an unexpected response shape',
      );
    }

    const record = value as Record<string, unknown>;
    const riskLevel = record.riskLevel;
    if (riskLevel !== 'low' && riskLevel !== 'medium' && riskLevel !== 'high') {
      throw new InternalServerErrorException(
        'Gemini response missing valid riskLevel',
      );
    }

    const flaggedCustomers = Array.isArray(record.flaggedCustomers)
      ? record.flaggedCustomers
          .filter(
            (item): item is { customerId: string; reason: string } =>
              !!item &&
              typeof item === 'object' &&
              typeof (item as { customerId?: unknown }).customerId ===
                'string' &&
              typeof (item as { reason?: unknown }).reason === 'string',
          )
          .map((item) => ({
            customerId: item.customerId,
            reason: item.reason,
          }))
      : [];

    return {
      riskLevel,
      fraudDetected: Boolean(record.fraudDetected),
      flaggedCustomers,
      narrative:
        typeof record.narrative === 'string'
          ? record.narrative
          : 'No narrative provided.',
    };
  }
}
