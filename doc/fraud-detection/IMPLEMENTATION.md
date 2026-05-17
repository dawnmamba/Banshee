# Fraud detection — implementation

## API contract

### `POST /customers/fraud-analysis`

**Auth:** Bearer JWT, `Admin` role.

**Response 200:**

```json
{
  "riskLevel": "low" | "medium" | "high",
  "fraudDetected": false,
  "flaggedCustomers": [
    { "customerId": "CUS0001", "reason": "..." }
  ],
  "narrative": "Full analysis text..."
}
```

**Errors:** `400` no imported data; `503` Gemini unavailable / missing API key.

## Test cases (TDD)

| ID | Requirement | Layer | Test file | Describes |
|----|-------------|-------|-----------|-----------|
| T1 | Reject when no customers | backend | `fraud-detection.service.spec.ts` | `analyze()` throws BadRequest |
| T2 | Calls Gemini with customer JSON | backend | `fraud-detection.service.spec.ts` | Payload + parse structured response |
| T3 | Controller delegates | backend | `transaction-history-import.controller.spec.ts` | `analyzeFraud()` |
| T4 | Button disabled when no rows | frontend | `FraudDetectionPanel.test.tsx` | Empty summary |
| T5 | Opens modal, loading, shows result | frontend | `FraudDetectionPanel.test.tsx` | Happy path |
| T6 | Wired on Customers page | frontend | `CustomersPage.test.tsx` | Detect fraud visible |

## Files

**Backend**

- `backend/src/fraud-detection/fraud-detection.service.ts`
- `backend/src/fraud-detection/fraud-detection.service.spec.ts`
- `backend/src/fraud-detection/gemini.service.ts`
- `backend/src/transaction-history-import/transaction-history-import.controller.ts` (route)
- `backend/src/transaction-history-import/transaction-history-import.module.ts`
- `backend/.env.example` (`GEMINI_API_KEY`, `GEMINI_MODEL`)

**Frontend**

- `frontend/src/components/customers/FraudDetectionPanel.tsx`
- `frontend/src/components/customers/FraudDetectionPanel.test.tsx`
- `frontend/src/components/customers/CustomersPage.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/primereact/auth-pt.ts` (dialog pass-through)

## TDD checklist

- [x] T1
- [x] T2
- [x] T3
- [x] T4
- [x] T5
- [x] T6
