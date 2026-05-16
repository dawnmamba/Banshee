'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { useEffect, useState, type ReactNode } from 'react';
import {
  AccountBalanceError,
  fetchAccountBalance,
  type AccountBalanceResponse,
} from '@/lib/api';

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; data: AccountBalanceResponse }
  | { status: 'missing_account'; message: string }
  | { status: 'error'; message: string };

const bannerClass =
  'w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900';

function BalanceBanner({ children }: { children: ReactNode }) {
  return <div className={bannerClass}>{children}</div>;
}

function mapError(err: unknown): LoadState {
  if (err instanceof AccountBalanceError && err.kind === 'missing_account') {
    return { status: 'missing_account', message: err.message };
  }
  const message =
    err instanceof AccountBalanceError
      ? err.message
      : 'Unable to retrieve account balance. Please try again.';
  return { status: 'error', message };
}

export function AccountBalanceBanner() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchAccountBalance()
      .then((data) => {
        if (!cancelled) {
          setState({ status: 'success', data });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState(mapError(err));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (state.status === 'loading') {
    return (
      <BalanceBanner>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Loading account balance…
        </p>
      </BalanceBanner>
    );
  }

  if (state.status === 'missing_account') {
    return (
      <BalanceBanner>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          {state.message}{' '}
          <Link
            href="/profile"
            className="font-medium text-zinc-900 underline underline-offset-2 dark:text-zinc-50"
          >
            Go to Profile
          </Link>
        </p>
      </BalanceBanner>
    );
  }

  if (state.status === 'error') {
    return (
      <BalanceBanner>
        <p className="text-sm text-red-600 dark:text-red-400">{state.message}</p>
        <Button
          type="button"
          label="Retry"
          severity="secondary"
          outlined
          size="small"
          onClick={() => {
            setState({ status: 'loading' });
            setReloadKey((k) => k + 1);
          }}
          className="mt-2 !w-auto"
        />
      </BalanceBanner>
    );
  }

  return (
    <BalanceBanner>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        Your account balance is{' '}
        <span className="font-semibold text-zinc-900 dark:text-zinc-50">
          {state.data.formattedBalance}
        </span>
      </p>
    </BalanceBanner>
  );
}
