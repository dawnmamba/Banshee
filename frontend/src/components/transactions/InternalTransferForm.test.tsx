import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { TRANSFER_VALIDATED_MESSAGE } from './transfer-validation';
import { InternalTransferForm } from './InternalTransferForm';

describe('InternalTransferForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows validation error when required fields are empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InternalTransferForm />);

    await user.click(screen.getByRole('button', { name: /submit transfer/i }));

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(/to account number is required/i);
  });

  it('shows success message when fields are valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InternalTransferForm />);

    await user.type(screen.getByLabelText(/to account number/i), '9876543210');
    await user.type(screen.getByLabelText(/^amount\b/i), '100.50');
    await user.click(screen.getByRole('button', { name: /submit transfer/i }));

    await waitFor(() => {
      expect(screen.getByText(TRANSFER_VALIDATED_MESSAGE)).toBeInTheDocument();
    });
  });
});
