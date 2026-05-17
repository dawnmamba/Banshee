# Bug reports: transactions

## BUG-001

| Field | Value |
|-------|-------|
| **Status** | fixed |
| **Severity** | medium |
| **Date opened** | 2026-05-17 |
| **PRD** | `doc/transactions/PRD.md` |
| **Linked requirements** | FR-12 |

### Summary

Transaction History tab date pickers did not show the selected date in the input field after picking from the calendar (and text could be unreadable in unstyled mode).

### Environment

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- PrimeReact 10.9.8 unstyled, React 19

### Steps to reproduce

1. Sign in with a profile account number and open `/transactions`.
2. Switch to the **History** tab.
3. Open **Start date** or **End date**, pick a day from the calendar.

### Expected vs actual

| | Behavior |
|---|----------|
| **Expected** | Input shows the chosen date (e.g. `17/05/2026`) for default range and after selection (FR-12). |
| **Actual** | Input appeared empty or unchanged after selection; selected day styling could throw before follow-up fix. |

### Root cause

1. Unstyled PrimeReact Calendar does not apply `p-calendar` / `p-inputtext` classes, so `globals.css` color rules never targeted the real inputs.
2. Calendar keeps the display value on the DOM input via refs; after controlled `value` updates (and loading re-renders from history fetch), the visible text was not always refreshed. The prior `blur()` workaround did not reliably run after panel selection.

### Regression test

| ID | Test file | Test name |
|----|-----------|-----------|
| T18 | `TransferHistoryDateRange.test.tsx` | displays the selected start and end dates in the calendar inputs |
| T18 | `TransferHistoryDateRange.test.tsx` | shows updated start date after parent rerender |
| T18 | `TransferHistoryDateRange.test.tsx` | updates the start date input after picking a date from the calendar |
| T18 | `transfer-history-calendar.test.ts` | syncCalendarInputDisplay writes/clears formatted value |

### Fixes applied

#### Fix attempt 1 (2026-05-17)

- **What changed:** `useLayoutEffect` syncs `#history-start-date` / `#history-end-date` from controlled `Date` state; `globals.css` targets those ids; removed ineffective blur-on-select helper; restored `calendarDaySelectedClass` for panel selection (prior commit).
- **Files:** `TransferHistoryDateRange.tsx`, `transfer-history-calendar.ts`, `globals.css`, `auth-pt.ts`, tests.
- **Why:** Ensures input text matches selected dates and is visible under unstyled + `data-theme` dark mode.

#### Fix attempt 2 (2026-05-17)

- **What changed:** Calendar `dropdownButton` pt now uses `!w-10 !flex-none` to override global `button` `w-full`; input uses `grow basis-0` so the text field fills the row.
- **Why previous fix failed:** Display sync/CSS were fixed, but the icon `Button` inherited `w-full` from `authPt.button`, leaving a narrow input and a wide clickable trigger.
- **Files:** `auth-pt.ts`, `TransferHistoryDateRange.test.tsx`

### Verification

- [x] `cd frontend && npm test -- --run TransferHistoryDateRange`
- [x] `cd frontend && npm test -- --run transfer-history-calendar`
- [x] `cd frontend && npm test -- --run`
- [x] `cd frontend && npm run lint`
- [x] `cd frontend && npm run build`
- [ ] Manual: History tab → pick start/end dates → inputs show `dd/mm/yyyy` text
