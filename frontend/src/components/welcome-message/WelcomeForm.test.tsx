import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WelcomeForm } from './WelcomeForm';

describe('WelcomeForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('displays welcome message after submit', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Welcome, Jane Doe' }),
      }),
    );

    render(<WelcomeForm />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Welcome, Jane Doe')).toBeInTheDocument();
    });
  });
});
