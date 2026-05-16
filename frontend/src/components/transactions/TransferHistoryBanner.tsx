import type { TransferHistoryRecord } from './dummy-transfer-history';

const bannerClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8';

const statusClass: Record<TransferHistoryRecord['status'], string> = {
  Completed:
    'rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-300',
  Pending:
    'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300',
};

const typeLabel: Record<TransferHistoryRecord['type'], string> = {
  internal: 'Internal',
  external: 'External',
};

type TransferHistoryBannerProps = {
  record: TransferHistoryRecord;
};

export function TransferHistoryBanner({ record }: TransferHistoryBannerProps) {
  return (
    <div className={bannerClass} data-testid="transfer-history-banner">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{record.date}</p>
        <span className={statusClass[record.status]}>{record.status}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {record.amount}
      </p>
      <p className="mt-2 text-base text-zinc-700 dark:text-zinc-300">
        <span className="font-medium">{typeLabel[record.type]}</span>
        <span className="text-zinc-500 dark:text-zinc-500"> · </span>
        {record.summary}
      </p>
    </div>
  );
}
