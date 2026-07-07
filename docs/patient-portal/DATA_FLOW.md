# Data Flow — Patient Portal

## Read (e.g. prescriptions)
Component → `usePrescriptionsQuery` → portal API client → BFF
`GET /portal/v1/prescriptions` → BFF resolves identity + consent + tenant authz
→ aggregates from tenant API(s) → normalizes + attaches provenance → returns
paginated envelope (with `partialFailures` if a source failed) → TanStack cache
(in-memory) → UI renders list/empty/error/partial states.

## Mutation (e.g. pay invoice)
Component → `usePayInvoiceMutation` (Idempotency-Key) → BFF intent → Razorpay
redirect → callback → BFF verifies + reconciles (authoritative) → invalidate
`portalKeys.invoices` + `payments`. No optimistic completion.

## Logout / account switch
Clear portal QueryClient cache, cancel in-flight (AbortSignal), drop cookie.

## Provenance rule
Source payload/reference preserved at BFF for audit/reconciliation; UI sees only
the normalized model — never raw ABDM/FHIR.
