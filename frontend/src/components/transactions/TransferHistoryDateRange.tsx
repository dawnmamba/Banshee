'use client';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FieldLabel } from '@/components/FieldLabel';
import {
  calendarInputClass,
  calendarPt,
  historySearchButtonPt,
} from '@/lib/primereact/auth-pt';
import { blurActiveInputAfterCalendarSelect } from './transfer-history-calendar';

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
  dateFormat: 'dd/mm/yy',
  showIcon: true,
  showOnFocus: true,
  readOnlyInput: true,
  inputClassName: calendarInputClass,
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
  const handleSelect = () => {
    blurActiveInputAfterCalendarSelect();
  };

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
            onSelect={handleSelect}
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
                onSelect={handleSelect}
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
