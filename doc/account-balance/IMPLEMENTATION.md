# Account balance — implementation

## API contract

### `GET /account/balance`

**Auth:** Bearer JWT

**Success `200`:**

```json
{
  "formattedBalance": "LKR 100,500.00",
  "currency": "LKR",
  "ledgerBalance": "10050000"
}
```

**Missing account number `400`:**

```json
{
  "statusCode": 400,
  "message": "Add your account number in Profile to view your balance.",
  "error": "Bad Request"
}
```

**Banking API failure `502`:**

```json
{
  "statusCode": 502,
  "message": "Unable to retrieve account balance. Please try again.",
  "error": "Bad Gateway"
}
```

### External banking API (backend only)

- Base: `BANKING_API_BASE_URL` (e.g. `http://34.21.206.87:3000`)
- Header: `x-api-key: BANKING_API_KEY`
- Path: `/Inquiry/Account/AccountInquiry/1.0/GetAccountBalance?AccountCategory=EXT&AccountNumber={accountNumber}`

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | FR-2 | backend | `banking-api.service.spec.ts` | `request()` prefixes base URL and sends `x-api-key` |
| T2 | FR-2 | backend | `banking-api.service.spec.ts` | non-OK HTTP throws `BankingApiError` |
| T3 | FR-4, FR-5, FR-6 | backend | `account-balance.service.spec.ts` | parses ledger balance and formats LKR |
| T4 | FR-3 | backend | `account-balance.service.spec.ts` | rejects when profile has no account number |
| T5 | FR-5 | backend | `account-balance.service.spec.ts` | rejects non-success banking status code |
| T6 | FR-3 | backend | `account-balance.controller.spec.ts` | `GET` returns balance DTO |
| T7 | FR-3 | backend | `test/account-balance.e2e-spec.ts` | HTTP 200 with mocked banking service |
| T8 | FR-7, FR-9 | frontend | `AccountBalanceBanner.test.tsx` | shows formatted balance after load |
| T9 | FR-8 | frontend | `AccountBalanceBanner.test.tsx` | missing account links to profile |
| T10 | FR-9 | frontend | `AccountBalanceBanner.test.tsx` | error state with retry |
| T11 | FR-7 | frontend | `HomePage.test.tsx` | welcome + balance banner |

## File list

### Backend

- `backend/src/banking-api/banking-api.config.ts`
- `backend/src/banking-api/banking-api.service.ts`
- `backend/src/banking-api/banking-api.service.spec.ts`
- `backend/src/banking-api/banking-api.module.ts`
- `backend/src/account-balance/account-balance.service.ts`
- `backend/src/account-balance/account-balance.controller.ts`
- `backend/src/account-balance/account-balance.module.ts`
- `backend/src/account-balance/account-balance.service.spec.ts`
- `backend/src/account-balance/account-balance.controller.spec.ts`
- `backend/src/app.module.ts` (import module)
- `backend/test/account-balance.e2e-spec.ts`
- `backend/.env.example`

### Frontend

- `frontend/src/components/account-balance/AccountBalanceBanner.tsx`
- `frontend/src/components/account-balance/AccountBalanceBanner.test.tsx`
- `frontend/src/components/account-balance/HomePage.tsx`
- `frontend/src/components/account-balance/HomePage.test.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/lib/api.ts` (`fetchAccountBalance`)

## TDD checklist

- [x] T1 — banking request URL and headers
- [x] T2 — banking HTTP error
- [x] T3 — parse and format balance
- [x] T4 — missing account number
- [x] T5 — banking status code
- [x] T6 — controller GET
- [x] T7 — e2e GET /account/balance
- [x] T8 — banner shows balance
- [x] T9 — banner profile link
- [x] T10 — banner retry
- [x] T11 — home welcome
