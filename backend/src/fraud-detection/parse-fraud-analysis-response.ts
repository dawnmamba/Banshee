import { InternalServerErrorException } from '@nestjs/common';
import type { FraudAnalysisResultDto } from './fraud-detection.types';

export function parseFraudAnalysisResponse(
  text: string,
): FraudAnalysisResultDto {
  const trimmed = text.trim();
  const jsonText = trimmed.startsWith('```')
    ? trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    : trimmed;

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new InternalServerErrorException(
      'AI model returned an invalid JSON response',
    );
  }

  return normalizeFraudAnalysisResult(parsed);
}

export function normalizeFraudAnalysisResult(
  value: unknown,
): FraudAnalysisResultDto {
  if (!value || typeof value !== 'object') {
    throw new InternalServerErrorException(
      'AI model returned an unexpected response shape',
    );
  }

  const record = value as Record<string, unknown>;
  const riskLevel = record.riskLevel;
  if (riskLevel !== 'low' && riskLevel !== 'medium' && riskLevel !== 'high') {
    throw new InternalServerErrorException(
      'AI model response missing valid riskLevel',
    );
  }

  const flaggedCustomers = Array.isArray(record.flaggedCustomers)
    ? record.flaggedCustomers
        .filter(
          (item): item is { customerId: string; reason: string } =>
            !!item &&
            typeof item === 'object' &&
            typeof (item as { customerId?: unknown }).customerId === 'string' &&
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
