import { cleanup, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RegisterForm } from './RegisterForm';
import { clearAuthToken, getAuthToken } from '@/lib/auth';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    clearAuthToken();
    replace.mockClear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders first name, last name, email, password, and confirm password fields', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('blocks submit when passwords do not match', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'different');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(/passwords do not match/i);
    });
  });

  it('submits register with names and stores token', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: 'jwt-token',
          user: {
            id: '1',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
          },
        }),
      }),
    );

    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(getAuthToken()).toBe('jwt-token');
      expect(replace).toHaveBeenCalledWith('/');
    });

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(JSON.parse(init.body as string)).toEqual({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
  });
});
