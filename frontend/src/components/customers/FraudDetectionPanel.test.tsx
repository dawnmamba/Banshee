import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import * as api from '@/lib/api';
import { FraudDetectionPanel } from './FraudDetectionPanel';

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>();
  return {
    ...actual,
    runFraudAnalysis: vi.fn(),
  };
});

describe('FraudDetectionPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('disables Detect fraud when hasCustomers is false', () => {
    renderWithProviders(<FraudDetectionPanel hasCustomers={false} />);

    expect(
      screen.getByRole('button', { name: /detect fraud/i }),
    ).toBeDisabled();
  });

  it('opens modal, shows loading, then displays analysis result', async () => {
    const user = userEvent.setup();
    vi.mocked(api.runFraudAnalysis).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                riskLevel: 'high',
                fraudDetected: true,
                flaggedCustomers: [
                  {
                    customerId: 'CUS0001',
                    reason: 'Large credit transfer',
                  },
                ],
                narrative: 'Suspicious inbound transfer detected.',
              }),
            50,
          );
        }),
    );

    renderWithProviders(<FraudDetectionPanel hasCustomers />);

    await user.click(screen.getByRole('button', { name: /detect fraud/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.runFraudAnalysis).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/high risk/i)).toBeInTheDocument();
      expect(screen.getByText(/fraud detected: yes/i)).toBeInTheDocument();
      expect(screen.getByText(/CUS0001/)).toBeInTheDocument();
      expect(
        screen.getByText(/Suspicious inbound transfer detected/i),
      ).toBeInTheDocument();
    });
  });
});
