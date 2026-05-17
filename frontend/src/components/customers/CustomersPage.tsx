'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import {
  fetchImportedCustomerTransactions,
  fetchTransactionImportSummary,
  type ImportedCustomerTransaction,
  type TransactionImportSummaryRow,
} from '@/lib/api';
import { secondaryButtonClass } from '@/lib/primereact/auth-pt';
import { TransactionImportPanel } from './TransactionImportPanel';

export function CustomersPage() {
  const [summary, setSummary] = useState<TransactionImportSummaryRow[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [transactions, setTransactions] = useState<
    ImportedCustomerTransaction[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const loadSummary = useCallback(() => {
    setLoadingSummary(true);
    setError(null);

    fetchTransactionImportSummary()
      .then((rows) => {
        setSummary(rows);
        setLoadingSummary(false);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : 'Failed to load import summary',
        );
        setLoadingSummary(false);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchTransactionImportSummary()
      .then((rows) => {
        if (!cancelled) {
          setSummary(rows);
          setLoadingSummary(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load import summary',
          );
          setLoadingSummary(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleViewTransactions(customerId: string) {
    setSelectedCustomerId(customerId);
    setLoadingTransactions(true);
    setError(null);
    try {
      const rows = await fetchImportedCustomerTransactions(customerId);
      setTransactions(rows);
    } catch (err) {
      setTransactions([]);
      setError(
        err instanceof Error ? err.message : 'Failed to load transactions',
      );
    } finally {
      setLoadingTransactions(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <header className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Customers
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Import bank transaction history JSON and review stored customer data.
        </p>
      </header>

      <section className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
        <TransactionImportPanel onImported={() => void loadSummary()} />
      </section>

      <section className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Imported customers
        </h2>

        {error && (
          <div className="mt-4">
            <Message severity="error" text={error} role="alert" />
          </div>
        )}

        {loadingSummary ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Loading summary…
          </p>
        ) : summary.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            No imported data yet. Upload a JSON file above.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-3 py-2 font-medium text-zinc-500">Customer</th>
                  <th className="px-3 py-2 font-medium text-zinc-500">Account</th>
                  <th className="px-3 py-2 font-medium text-zinc-500">Branch</th>
                  <th className="px-3 py-2 font-medium text-zinc-500">Currency</th>
                  <th className="px-3 py-2 font-medium text-zinc-500">Balance</th>
                  <th className="px-3 py-2 font-medium text-zinc-500">Txns</th>
                  <th className="px-3 py-2 font-medium text-zinc-500" />
                </tr>
              </thead>
              <tbody>
                {summary.map((row) => (
                  <tr
                    key={row.customerId}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-2 text-zinc-900 dark:text-zinc-50">
                      {row.customerId}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {row.accountShortName}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {row.accountBranch}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {row.currency}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {row.availableBalance}
                    </td>
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {row.transactionCount}
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        type="button"
                        label="View"
                        aria-label={`View transactions for ${row.customerId}`}
                        pt={{
                          root: { className: secondaryButtonClass },
                        }}
                        onClick={() => void handleViewTransactions(row.customerId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedCustomerId && (
          <div className="mt-8 space-y-3">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Transactions for {selectedCustomerId}
            </h3>
            {loadingTransactions ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Loading transactions…
              </p>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No transactions for this customer.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-3 py-2 font-medium text-zinc-500">Date</th>
                      <th className="px-3 py-2 font-medium text-zinc-500">Type</th>
                      <th className="px-3 py-2 font-medium text-zinc-500">Amount</th>
                      <th className="px-3 py-2 font-medium text-zinc-500">Balance</th>
                      <th className="px-3 py-2 font-medium text-zinc-500">Key</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.uniqueKey}
                        className="border-b border-zinc-100 dark:border-zinc-900"
                      >
                        <td className="px-3 py-2">{tx.postingDate}</td>
                        <td className="px-3 py-2">{tx.transactionCodeName}</td>
                        <td className="px-3 py-2">{tx.postingAmount}</td>
                        <td className="px-3 py-2">{tx.runningBalance}</td>
                        <td className="px-3 py-2 font-mono text-xs">
                          {tx.uniqueKey}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
