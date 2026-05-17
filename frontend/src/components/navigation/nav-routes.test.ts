import { describe, it, expect } from 'vitest';
import { NAV_ROUTES } from './nav-routes';

describe('NAV_ROUTES', () => {
  it('includes only Home and Transactions for logged-in user nav', () => {
    expect(NAV_ROUTES).toEqual([
      { href: '/', label: 'Home' },
      { href: '/transactions', label: 'Transactions' },
    ]);
  });

  it('does not include Welcome or Health demo links', () => {
    const labels = NAV_ROUTES.map((route) => route.label);
    const hrefs = NAV_ROUTES.map((route) => route.href);

    expect(labels).not.toContain('Welcome');
    expect(labels).not.toContain('Health');
    expect(hrefs).not.toContain('/welcome');
    expect(hrefs).not.toContain('/health');
  });
});
