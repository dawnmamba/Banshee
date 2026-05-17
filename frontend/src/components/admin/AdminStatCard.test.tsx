import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { AdminStatCard } from './AdminStatCard';

describe('AdminStatCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders label and value', () => {
    renderWithProviders(
      <AdminStatCard
        label="Total users"
        value={42}
        iconClass="pi pi-users"
        hint="All registered accounts"
      />,
    );

    expect(screen.getByText('Total users')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('All registered accounts')).toBeInTheDocument();
  });
});
