import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { DUMMY_TRANSFER_HISTORY } from './dummy-transfer-history';
import { TransferHistoryPanel } from './TransferHistoryPanel';

describe('TransferHistoryPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders each dummy transfer as a banner', () => {
    renderWithProviders(<TransferHistoryPanel />);

    const banners = screen.getAllByTestId('transfer-history-banner');
    expect(banners).toHaveLength(DUMMY_TRANSFER_HISTORY.length);

    expect(screen.getByText('$150.00')).toBeInTheDocument();
    expect(screen.getByText(/jane doe • chase bank/i)).toBeInTheDocument();
    expect(screen.getAllByText(/completed/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });
});
