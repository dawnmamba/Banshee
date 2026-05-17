# Fraud detection (Azure AI Foundry) — PRD

## Overview

Admins on the **Customers** page can run AI-assisted fraud analysis over all imported customer records (with account summary, inquiry status, and transactions). Results appear in a modal after the backend calls an Azure AI Foundry hosted model.

## Problem statement

Imported bank transaction data may contain suspicious patterns. Manual review does not scale; admins need a one-click analysis that aggregates all customers and surfaces structured risk signals plus an explanatory narrative.

## Goals

- One **Detect fraud** action on `/customers` (admin-only).
- Backend loads **all** imported customers with relations, sends JSON to an **Azure AI Foundry** hosted model (credentials server-side only).
- Modal shows loading state, then **structured summary** (risk level, fraud flag, flagged customers) and **narrative** text.
- Button **disabled** when no imported customers exist.

## User stories

1. As an **admin**, I want to click **Detect fraud** so that all imported customers are analyzed in one batch.
2. As an **admin**, I want a **modal with a loading state** so I know the analysis is in progress.
3. As an **admin**, I want a **structured summary** (risk, flagged customers) and **narrative** so I can act on findings quickly.

## Functional requirements

1. `POST /customers/fraud-analysis` (JWT + Admin role) returns `{ riskLevel, fraudDetected, flaggedCustomers, narrative }`.
2. Endpoint loads every `imported_customers` row with `inquiryStatus`, `accountSummary`, and `transactions`.
3. Backend serializes that data as JSON and prompts the Foundry deployment; response is parsed into the contract above.
4. Missing Azure AI Foundry config yields a clear 503/500 error message (no credentials in client).
5. Empty import data: endpoint returns 400; frontend disables the button when summary is empty.
6. Customers page: **Detect fraud** opens PrimeReact `Dialog`, shows spinner/text while waiting, then results or error.

## Non-goals

- Persisting analysis history.
- Per-customer-only analysis.
- Real-time streaming from the model.
- Non-admin access.

## Success metrics

- E2E/unit tests pass; manual smoke with valid Azure AI Foundry env returns modal content.
- API key never exposed to the browser.

## Open questions

- None for MVP.

## UI requirements

- PrimeReact unstyled: `Button`, `Dialog`, `Message` with `auth-pt` / `secondaryButtonClass` / `historySearchButtonPt` patterns.
- Modal: title, loading state, structured block (risk badge, fraud yes/no, flagged list), narrative in readable prose.
- Dark mode consistent with zinc Customers page.
