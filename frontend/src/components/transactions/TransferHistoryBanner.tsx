import type { TransactionHistoryItem } from '@/lib/api';

const bannerClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8';

const statusClass =
  'rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200';

type TransferHistoryBannerProps = {
  record: TransactionHistoryItem;
};

export function TransferHistoryBanner({ record }: TransferHistoryBannerProps) {
  const amountClass = record.isDebit
    ? 'mt-3 text-2xl font-semibold tracking-tight text-red-600 dark:text-red-400'
    : 'mt-3 text-2xl font-semibold tracking-tight text-green-700 dark:text-green-400';

  return (
    <div className={bannerClass} data-testid="transfer-history-banner">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {record.displayDate}
        </p>
        <span className={statusClass}>{record.statusLabel}</span>
      </div>
      <p className={amountClass}>{record.formattedAmount}</p>
      <p className="mt-2 text-base text-zinc-700 dark:text-zinc-300">
        {record.summary}
      </p>
    </div>
  );
}
