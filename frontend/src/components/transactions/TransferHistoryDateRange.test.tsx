import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { formatPrimeCalendarDate } from './transfer-history-calendar';
import { TransferHistoryDateRange } from './TransferHistoryDateRange';

function ControlledDateRange({
  initialStart,
  initialEnd,
}: {
  initialStart: Date;
  initialEnd: Date;
}) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  return (
    <TransferHistoryDateRange
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onSearch={vi.fn()}
    />
  );
}

describe('TransferHistoryDateRange', () => {
  afterEach(() => {
    cleanup();
  });

  it('uses a compact calendar icon button that does not stretch full width', () => {
    renderWithProviders(
      <TransferHistoryDateRange
        startDate={new Date(2026, 0, 15)}
        endDate={new Date(2026, 0, 31)}
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    const triggers = screen.getAllByRole('button', { name: /choose date/i });
    expect(triggers).toHaveLength(2);
    for (const trigger of triggers) {
      expect(trigger.className).toMatch(/!w-10/);
      expect(trigger.className).toMatch(/!flex-none/);
    }

    const startInput = screen.getByLabelText(/start date/i);
    expect(startInput.className).toMatch(/\bgrow\b/);
  });

  it('displays the selected start and end dates in the calendar inputs', () => {
    const startDate = new Date(2026, 0, 15);
    const endDate = new Date(2026, 0, 31);

    renderWithProviders(
      <TransferHistoryDateRange
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/start date/i)).toHaveValue(
      formatPrimeCalendarDate(startDate),
    );
    expect(screen.getByLabelText(/end date/i)).toHaveValue(
      formatPrimeCalendarDate(endDate),
    );
  });

  it('shows updated start date after parent rerender', () => {
    const startDate = new Date(2026, 0, 15);
    const endDate = new Date(2026, 0, 31);
    const { rerender } = renderWithProviders(
      <TransferHistoryDateRange
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    const startInput = screen.getByLabelText(/start date/i);
    expect(startInput).toHaveValue(formatPrimeCalendarDate(startDate));

    const newStart = new Date(2026, 0, 10);
    rerender(
      <TransferHistoryDateRange
        startDate={newStart}
        endDate={endDate}
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    expect(startInput).toHaveValue(formatPrimeCalendarDate(newStart));
  });

  it('updates the start date input after picking a date from the calendar', async () => {
    const user = userEvent.setup();
    const startDate = new Date(2026, 0, 15);
    const endDate = new Date(2026, 0, 31);

    renderWithProviders(
      <ControlledDateRange initialStart={startDate} initialEnd={endDate} />,
    );

    const startInput = screen.getByLabelText(/start date/i);
    await user.click(startInput);

    const dayTen = await screen.findByText('10', {
      selector: 'span[data-pc-section="daylabel"]',
    });
    await user.click(dayTen);

    expect(startInput).toHaveValue(formatPrimeCalendarDate(new Date(2026, 0, 10)));
  });
});
