/** Matches PrimeReact Calendar `dateFormat="dd/mm/yy"` (yy renders as 4-digit year). */
export function formatPrimeCalendarDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

/** Keep Calendar input text in sync after controlled value changes (unstyled + React 19). */
export function syncCalendarInputDisplay(
  inputId: string,
  date: Date | null,
): void {
  const input = document.getElementById(inputId);
  if (!(input instanceof HTMLInputElement)) {
    return;
  }
  input.value = date ? formatPrimeCalendarDate(date) : '';
}
