import { extractBankingStatusMessage } from './banking-api-status';

describe('extractBankingStatusMessage', () => {
  it('reads Message from nested banking response envelopes', () => {
    const message = extractBankingStatusMessage({
      FundsTransfer_Response: {
        Status: {
          Code: '9040',
          Message:
            'Account 001001338903101 not authorized for your subscription',
        },
      },
    });

    expect(message).toBe(
      'Account 001001338903101 not authorized for your subscription',
    );
  });
});
