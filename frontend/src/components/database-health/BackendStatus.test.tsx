import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BackendStatus } from '@/components/BackendStatus';

describe('BackendStatus (database-health)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows database up when health API reports database up', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'ok',
          timestamp: '2026-05-16T12:00:00.000Z',
          database: 'up',
        }),
      }),
    );

    render(<BackendStatus />);

    await waitFor(() => {
      expect(screen.getByTestId('database-status')).toHaveTextContent('Up');
    });
  });

  it('shows database down when health API reports database down', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'degraded',
          timestamp: '2026-05-16T12:00:00.000Z',
          database: 'down',
        }),
      }),
    );

    render(<BackendStatus />);

    await waitFor(() => {
      expect(screen.getByTestId('database-status')).toHaveTextContent('Down');
    });
  });
});
