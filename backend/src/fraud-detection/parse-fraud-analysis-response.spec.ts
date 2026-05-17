import { InternalServerErrorException } from '@nestjs/common';
import { parseFraudAnalysisResponse } from './parse-fraud-analysis-response';

describe('parseFraudAnalysisResponse', () => {
  it('parses valid JSON text', () => {
    const result = parseFraudAnalysisResponse(
      JSON.stringify({
        riskLevel: 'medium',
        fraudDetected: true,
        flaggedCustomers: [{ customerId: 'CUS1', reason: 'test' }],
        narrative: 'Review needed.',
      }),
    );

    expect(result).toEqual({
      riskLevel: 'medium',
      fraudDetected: true,
      flaggedCustomers: [{ customerId: 'CUS1', reason: 'test' }],
      narrative: 'Review needed.',
    });
  });

  it('strips markdown fences', () => {
    const result = parseFraudAnalysisResponse(
      '```json\n{"riskLevel":"low","fraudDetected":false,"flaggedCustomers":[],"narrative":"ok"}\n```',
    );

    expect(result.riskLevel).toBe('low');
    expect(result.fraudDetected).toBe(false);
  });

  it('throws when JSON is invalid', () => {
    expect(() => parseFraudAnalysisResponse('not json')).toThrow(
      InternalServerErrorException,
    );
  });
});
