'use client';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FieldLabel } from '@/components/FieldLabel';
import { calendarPt, historySearchButtonPt } from '@/lib/primereact/auth-pt';

type TransferHistoryDateRangeProps = {
  startDate: Date | null;
  endDate: Date | null;
  loading?: boolean;
  onStartDateChange: (value: Date | null) => void;
  onEndDateChange: (value: Date | null) => void;
  onSearch: () => void;
};

const calendarProps = {
  pt: calendarPt,
  dateFormat: 'yy-mm-dd',
  showIcon: true,
  showOnFocus: true,
  readOnlyInput: true,
  appendTo: typeof document === 'undefined' ? undefined : document.body,
} as const;

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
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 w-full sm:max-w-[min(100%,20rem)]">
          <FieldLabel htmlFor="history-start-date" required>
            Start date
          </FieldLabel>
          <Calendar
            {...calendarProps}
            inputId="history-start-date"
            value={startDate}
            onChange={(e) => onStartDateChange((e.value as Date | null) ?? null)}
            maxDate={endDate ?? undefined}
          />
        </div>
        <div className="min-w-0 w-full sm:max-w-[min(100%,20rem)] sm:ml-auto">
          <div className="flex flex-col sm:items-end">
            <FieldLabel htmlFor="history-end-date" required>
              End date
            </FieldLabel>
            <div className="w-full">
              <Calendar
                {...calendarProps}
                inputId="history-end-date"
                value={endDate}
                onChange={(e) =>
                  onEndDateChange((e.value as Date | null) ?? null)
                }
                minDate={startDate ?? undefined}
              />
            </div>
          </div>
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
