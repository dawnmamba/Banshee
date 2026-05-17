import { afterEach, describe, expect, it, vi } from 'vitest';
import { blurActiveInputAfterCalendarSelect } from './transfer-history-calendar';

describe('blurActiveInputAfterCalendarSelect', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('blurs the focused input after a tick', () => {
    vi.useFakeTimers();
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    const blurSpy = vi.spyOn(input, 'blur');

    blurActiveInputAfterCalendarSelect();
    vi.runAllTimers();

    expect(blurSpy).toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
