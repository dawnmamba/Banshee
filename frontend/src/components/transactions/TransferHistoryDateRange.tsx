'use client';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FieldLabel } from '@/components/FieldLabel';
import { historySearchButtonPt } from '@/lib/primereact/auth-pt';

type TransferHistoryDateRangeProps = {
  startDate: Date | null;
  endDate: Date | null;
  loading?: boolean;
  onStartDateChange: (value: Date | null) => void;
  onEndDateChange: (value: Date | null) => void;
  onSearch: () => void;
};

export function TransferHistoryDateRange({
  startDate,
  endDate,
  loading = false,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}: TransferHistoryDateRangeProps) {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="history-start-date" required>
            Start date
          </FieldLabel>
          <Calendar
            inputId="history-start-date"
            value={startDate}
            onChange={(e) => onStartDateChange((e.value as Date | null) ?? null)}
            dateFormat="yy-mm-dd"
            showIcon
            maxDate={endDate ?? undefined}
          />
        </div>
        <div>
          <FieldLabel htmlFor="history-end-date" required>
            End date
          </FieldLabel>
          <Calendar
            inputId="history-end-date"
            value={endDate}
            onChange={(e) => onEndDateChange((e.value as Date | null) ?? null)}
            dateFormat="yy-mm-dd"
            showIcon
            minDate={startDate ?? undefined}
          />
        </div>
      </div>
      <Button
        type="button"
        label={loading ? 'Searching…' : 'Search'}
        pt={historySearchButtonPt}
        loading={loading}
        disabled={loading || !startDate || !endDate}
        onClick={onSearch}
      />
    </div>
  );
}
