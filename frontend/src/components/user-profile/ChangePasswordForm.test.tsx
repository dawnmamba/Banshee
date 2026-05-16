import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangePasswordForm } from './ChangePasswordForm';

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('submits password change', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    renderWithProviders(<ChangePasswordForm />);

    await user.type(screen.getByLabelText(/current password/i), 'oldpass12');
    await user.type(screen.getByLabelText(/new password/i), 'newpass12');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpass12');
    await user.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/profile/change-password'),
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });
});
