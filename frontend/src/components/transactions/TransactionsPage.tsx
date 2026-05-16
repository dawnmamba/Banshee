'use client';

import Link from 'next/link';
import { SelectButton } from 'primereact/selectbutton';
import { useEffect, useState } from 'react';
import { fetchProfile } from '@/lib/api';
import { transactionsTabSelectPt } from '@/lib/primereact/auth-pt';

type TabValue = 'transfer' | 'history';

const TAB_OPTIONS: { label: string; value: TabValue }[] = [
  { label: 'Transfer', value: 'transfer' },
  { label: 'History', value: 'history' },
];

const MISSING_ACCOUNT_MESSAGE =
  'Add your account number in Profile to use transactions.';

const panelClass =
  'rounded-xl border border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; hasAccount: boolean }
  | { status: 'error' };

export function TransactionsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [activeTab, setActiveTab] = useState<TabValue>('transfer');

  useEffect(() => {
    let cancelled = false;

    fetchProfile()
      .then((profile) => {
        if (!cancelled) {
          const hasAccount = Boolean(profile.accountNumber?.trim());
          setLoadState({ status: 'ready', hasAccount });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadState({ status: 'error' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-6 py-10 dark:bg-black sm:px-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Transactions
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Move funds and review past transfers.
          </p>
        </header>

        {loadState.status === 'loading' && (
          <p className="text-base text-zinc-600 dark:text-zinc-400">Loading…</p>
        )}

        {loadState.status === 'error' && (
          <p className="text-base text-red-600 dark:text-red-400">
            Unable to load your profile. Please try again later.
          </p>
        )}

        {loadState.status === 'ready' && !loadState.hasAccount && (
          <div className={panelClass}>
            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {MISSING_ACCOUNT_MESSAGE}{' '}
              <Link
                href="/profile"
                className="font-medium text-zinc-900 underline underline-offset-2 dark:text-zinc-50"
              >
                Go to Profile
              </Link>
            </p>
          </div>
        )}

        {loadState.status === 'ready' && loadState.hasAccount && (
          <div className="space-y-6">
            <SelectButton
              pt={transactionsTabSelectPt}
              value={activeTab}
              onChange={(e) => {
                if (e.value) {
                  setActiveTab(e.value);
                }
              }}
              options={TAB_OPTIONS}
              optionLabel="label"
              optionValue="value"
              aria-label="Transaction sections"
              itemTemplate={(option: (typeof TAB_OPTIONS)[number]) => (
                <span className="text-sm font-medium">{option.label}</span>
              )}
            />

            <div className={panelClass}>
              {activeTab === 'transfer' ? (
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  Fund transfer options will appear here.
                </p>
              ) : (
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  Transfer history will appear here.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
