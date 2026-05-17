import { describe, expect, it } from 'vitest';
import {
  formatPrimeCalendarDate,
  syncCalendarInputDisplay,
} from './transfer-history-calendar';

describe('formatPrimeCalendarDate', () => {
  it('formats dates like PrimeReact dd/mm/yy', () => {
    expect(formatPrimeCalendarDate(new Date(2026, 0, 15))).toBe('15/01/2026');
  });
});

describe('syncCalendarInputDisplay', () => {
  it('writes the formatted date into the calendar input', () => {
    const input = document.createElement('input');
    input.id = 'history-start-date';
    document.body.appendChild(input);

    syncCalendarInputDisplay('history-start-date', new Date(2026, 0, 10));

    expect(input).toHaveValue('10/01/2026');
    document.body.removeChild(input);
  });

  it('clears the input when date is null', () => {
    const input = document.createElement('input');
    input.id = 'history-end-date';
    input.value = '31/01/2026';
    document.body.appendChild(input);

    syncCalendarInputDisplay('history-end-date', null);

    expect(input).toHaveValue('');
    document.body.removeChild(input);
  });
});
