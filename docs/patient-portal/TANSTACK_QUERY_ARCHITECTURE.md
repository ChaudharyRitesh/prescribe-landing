# TanStack Query Architecture — Patient Portal

Exclusive server-state layer. No Redux/Zustand for API data.

## Building blocks
- **Query-key factory** per context: `portalKeys.prescriptions.list(filters)` etc. Keys use **opaque IDs only** — never phone/email/medical text.
- **Typed API client**: `features/patient-portal/shared/api/client.ts` (axios → BFF). Centralized error + auth-error translation.
- **Custom hooks** (the only way components fetch): `usePatientSummaryQuery`, `useHealthTimelineQuery`, `useEncounterDetailsQuery`, `usePrescriptionsQuery`, `useLabReportsQuery`, `useInvoicesQuery`, `usePaymentsQuery`, `useConsentRequestsQuery`, `useAbhaLinkStatusQuery`; mutations `useRequestOtpMutation`, `useVerifyOtpMutation`, `useLinkAbhaMutation`, `useRespondToConsentMutation`, `useRevokeConsentMutation`, `useDownloadRecordMutation`.

## Rules (enforced in review)
- No PHI in query keys.
- PHI cache **in-memory only**; never persist to localStorage/unencrypted IDB.
- Clear all portal caches on logout / account switch; cancel in-flight on context change (AbortSignal).
- No auto-retry on authz/validation/consent-denied; bounded exp backoff for transient only.
- Idempotency keys on payment/consent/linking mutations.
- Optimistic updates only for safe/reversible actions — never clinical truth, payment completion, or consent status.
- Per-domain `staleTime` (e.g. profile long, bills short, consent very short). No single global policy.

## Provider
Portal-scoped `QueryClient` in `app/portal/layout.tsx` (separate from marketing
`app/providers.tsx`), with PHI-safe defaults + logout cache reset.
