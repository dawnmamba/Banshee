import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountInfoSection } from './AccountInfoSection';

const profile = {
  id: '1',
  email: 'a@b.com',
  firstName: 'Jane',
  lastName: 'Doe',
  accountNumber: null,
  nic: null,
  address: null,
  mobile: null,
  landline: null,
  secondaryEmail: null,
};

describe('AccountInfoSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads account fields and saves updates', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => profile,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...profile,
          firstName: 'Janet',
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    renderWithProviders(<AccountInfoSection />);

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    });

    const firstName = screen.getByLabelText(/first name/i);
    await user.clear(firstName);
    await user.type(firstName, 'Janet');
    await user.click(screen.getByRole('button', { name: /save account/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/profile/account'),
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });
});
