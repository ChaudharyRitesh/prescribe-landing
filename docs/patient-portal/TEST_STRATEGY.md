# Test Strategy — Patient Portal

Pyramid appropriate to the repo (Next + React + MUI + TanStack).

## Unit
Domain transforms, zod schemas, query-key factories, error translation, authz
helpers, date/display helpers, record grouping/sorting, consent-state mapping.

## Component (RTL + jest-axe)
Loading/empty/error/permission-denied states, responsive, keyboard nav, SR
labels, forms, OTP input, record cards, consent controls.

## Integration
API client + hooks, auth lifecycle, cache invalidation, account switching,
partial provider failures, pagination, secure document retrieval, consent
changes, ABDM adapter behaviour (mocked).

## E2E (later, Playwright)
Phone/email OTP login, session expiry, dashboard load, view Rx/lab/invoice,
authorized download, ABHA link (mock sandbox), consent grant/revoke, logout +
cache-clear, unauthorized cross-patient + cross-tenant access denied.

## Rules
Realistic fixtures, **no real patient data**. No "passed" claim without command
output. Mocks-only passing ≠ done.

> Repo currently has no test runner configured for the app — add Vitest/Jest +
> RTL as a Slice 1 follow-up task (documented dependency add).
