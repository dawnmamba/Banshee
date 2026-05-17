import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { TRANSFER_VALIDATED_MESSAGE } from './transfer-validation';
import { ExternalTransferForm } from './ExternalTransferForm';

describe('ExternalTransferForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows validation error when required fields are empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExternalTransferForm />);

    await user.click(screen.getByRole('button', { name: /submit transfer/i }));

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(/beneficiary name is required/i);
  });

  it('shows success message when fields are valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExternalTransferForm />);

    await user.type(screen.getByLabelText(/beneficiary name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/routing number/i), '021000021');
    await user.type(
      screen.getByLabelText(/^account number\b/i),
      '123456789',
    );
    await user.type(screen.getByLabelText(/^amount\b/i), '250');
    await user.click(screen.getByRole('button', { name: /submit transfer/i }));

    await waitFor(() => {
      expect(screen.getByText(TRANSFER_VALIDATED_MESSAGE)).toBeInTheDocument();
    });
  });
});
