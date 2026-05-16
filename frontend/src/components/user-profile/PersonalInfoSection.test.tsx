import { cleanup, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PersonalInfoSection } from './PersonalInfoSection';

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

describe('PersonalInfoSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows NIC validation error for invalid format', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => profile,
      }),
    );

    renderWithProviders(<PersonalInfoSection />);

    await waitFor(() => {
      expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/account number/i), 'ACC1');
    await user.type(screen.getByLabelText(/^nic/i), 'bad-nic');
    await user.click(screen.getByRole('button', { name: /save personal/i }));

    expect(
      await screen.findByText(/9 digits followed by v or x/i),
    ).toBeInTheDocument();
  });

  it('saves valid personal info', async () => {
    cleanup();
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
          accountNumber: 'ACC1',
          nic: '123456789V',
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    renderWithProviders(<PersonalInfoSection />);

    await waitFor(() => {
      expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/account number/i), 'ACC1');
    await user.type(screen.getByLabelText(/^nic/i), '123456789V');
    await user.click(screen.getByRole('button', { name: /save personal/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/profile/personal'),
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });
});
