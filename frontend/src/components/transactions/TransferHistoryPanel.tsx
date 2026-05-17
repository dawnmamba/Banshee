'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchTransactionHistory,
  TransactionHistoryError,
  type TransactionHistoryResponse,
} from '@/lib/api';
import { TransferHistoryBanner } from './TransferHistoryBanner';
import { TransferHistoryDateRange } from './TransferHistoryDateRange';
import {
  defaultHistoryDateRange,
  formatDateQueryParam,
} from './transfer-history-dates';

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; data: TransactionHistoryResponse }
  | { status: 'missing_account'; message: string }
  | { status: 'error'; message: string };

const bannerClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8';

export function TransferHistoryPanel() {
  const defaults = defaultHistoryDateRange();
  const [startDate, setStartDate] = useState<Date | null>(defaults.startDate);
  const [endDate, setEndDate] = useState<Date | null>(defaults.endDate);
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  const startDateParam = startDate ? formatDateQueryParam(startDate) : null;
  const endDateParam = endDate ? formatDateQueryParam(endDate) : null;

  useEffect(() => {
    if (!startDateParam || !endDateParam) {
      return;
    }

    let cancelled = false;

    fetchTransactionHistory(startDateParam, endDateParam)
      .then((data) => {
        if (!cancelled) {
          setLoadState({ status: 'success', data });
        }
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }
        if (
          err instanceof TransactionHistoryError &&
          err.kind === 'missing_account'
        ) {
          setLoadState({ status: 'missing_account', message: err.message });
          return;
        }
        const message =
          err instanceof TransactionHistoryError
            ? err.message
            : 'Unable to retrieve transaction history. Please try again.';
        setLoadState({ status: 'error', message });
      });

    return () => {
      cancelled = true;
    };
  }, [endDateParam, reloadKey, startDateParam]);

  const markLoading = useCallback(() => {
    setLoadState({ status: 'loading' });
  }, []);

  const handleStartDateChange = useCallback(
    (value: Date | null) => {
      markLoading();
      setStartDate(value);
    },
    [markLoading],
  );

  const handleEndDateChange = useCallback(
    (value: Date | null) => {
      markLoading();
      setEndDate(value);
    },
    [markLoading],
  );

  const triggerSearch = useCallback(() => {
    markLoading();
    setReloadKey((key) => key + 1);
  }, [markLoading]);

  const loading = loadState.status === 'loading';

  return (
    <div className="space-y-4" aria-label="Transfer history">
      <TransferHistoryDateRange
        startDate={startDate}
        endDate={endDate}
        loading={loading}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onSearch={triggerSearch}
      />

      {loadState.status === 'missing_account' && (
        <div className={bannerClass}>
          <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {loadState.message}{' '}
            <Link
              href="/profile"
              className="font-medium text-zinc-900 underline underline-offset-2 dark:text-zinc-50"
            >
              Go to Profile
            </Link>
          </p>
        </div>
      )}

      {loadState.status === 'error' && (
        <div className={bannerClass}>
          <p className="text-base text-red-600 dark:text-red-400">
            {loadState.message}
          </p>
          <Button
            type="button"
            label="Retry"
            severity="secondary"
            outlined
            size="small"
            onClick={triggerSearch}
            className="mt-3 !w-auto"
          />
        </div>
      )}

      {loadState.status === 'success' && loadState.data.transactions.length === 0 && (
        <div className={bannerClass}>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            No transactions found for this date range.
          </p>
        </div>
      )}

      {loadState.status === 'success' &&
        loadState.data.transactions.map((record) => (
          <TransferHistoryBanner key={record.id} record={record} />
        ))}
    </div>
  );
}
