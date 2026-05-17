/** Blur after pick so PrimeReact refreshes the input display (see onInputBlur). */
export function blurActiveInputAfterCalendarSelect(): void {
  setTimeout(() => {
    const active = document.activeElement;
    if (active instanceof HTMLInputElement) {
      active.blur();
    }
  }, 0);
}
