'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchHealth } from '@/lib/api';

type Status = 'loading' | 'up' | 'down';
type DatabaseStatus = 'up' | 'down' | null;

const POLL_INTERVAL_MS = 10_000;

export function BackendStatus() {
  const [status, setStatus] = useState<Status>('loading');
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [serverTimestamp, setServerTimestamp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const data = await fetchHealth();
      setStatus('up');
      setDatabaseStatus(data.database);
      setServerTimestamp(data.timestamp);
      setLastChecked(new Date().toISOString());
    } catch (err) {
      setStatus('down');
      setDatabaseStatus(null);
      setServerTimestamp(null);
      setLastChecked(new Date().toISOString());
      setError(err instanceof Error ? err.message : 'Failed to reach backend');
    }
  }, []);

  useEffect(() => {
    const initial = setTimeout(() => void check(), 0);
    const id = setInterval(() => void check(), POLL_INTERVAL_MS);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [check]);

  const statusLabel =
    status === 'loading' ? 'Checking…' : status === 'up' ? 'Up' : 'Down';

  const statusColors =
    status === 'up'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
      : status === 'down'
        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';

  return (
    <div className="w-full max-w-md rounded-2xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-6">
        <span
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${statusColors}`}
        >
          <span
            className={`mr-2 h-2 w-2 rounded-full ${
              status === 'up'
                ? 'bg-emerald-500'
                : status === 'down'
                  ? 'bg-red-500'
                  : 'animate-pulse bg-zinc-400'
            }`}
          />
          {statusLabel}
        </span>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            {status === 'up'
              ? 'Backend is up'
              : status === 'down'
                ? 'Backend is down'
                : 'Checking backend…'}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Life check polls every 10 seconds
          </p>
        </div>

        <dl className="w-full space-y-3 text-sm">
          {lastChecked && (
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">Last checked</dt>
              <dd className="font-mono text-right text-zinc-900 dark:text-zinc-100">
                {new Date(lastChecked).toLocaleString()}
              </dd>
            </div>
          )}
          {databaseStatus !== null && (
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">Database</dt>
              <dd
                data-testid="database-status"
                className={`font-semibold text-right ${
                  databaseStatus === 'up'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {databaseStatus === 'up' ? 'Up' : 'Down'}
              </dd>
            </div>
          )}
          {serverTimestamp && (
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">
                Server timestamp
              </dt>
              <dd className="font-mono text-right text-zinc-900 dark:text-zinc-100">
                {new Date(serverTimestamp).toLocaleString()}
              </dd>
            </div>
          )}
          {error && (
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">Error</dt>
              <dd className="text-right text-red-600 dark:text-red-400">
                {error}
              </dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={() => void check()}
          disabled={status === 'loading'}
          className="flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
