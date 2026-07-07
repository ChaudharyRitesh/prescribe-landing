# Implementation Plan — Patient Portal

Updated per D1–D9. Each slice independently testable. Human approval gates
(spec §15) block production auth, ABDM activation, payment activation, identity
migration.

## Slice 0 — Discovery ✓
- [x] Verify repos/stacks/existing portal/backend gaps
- [x] docs/patient-portal artifacts + ADRs (incl D1–D9, ADR-007..015)
- [x] Risk register updated (R5/R6→High; R8–R17 added)

## Slice 1 — Foundation (relocate to `apps/patient-portal`, D1)
Scope: isolated Next app shell, MUI theme, responsive nav, typed API client
(cookie session), PHI-safe TanStack provider, error/loading/empty states, a11y
baseline, feature-module skeleton. **No auth/ABDM/payments.**
- [x] Built initial shell (was `app/portal/**`)
- [ ] **Move** shell + `features/patient-portal/**` into `apps/patient-portal`
- [ ] Remove portal from marketing route tree; no Sanity/analytics/tag-managers in portal runtime
- [ ] Separate Next config + env example + scoped CSP/security headers
- [ ] tsc strict + build green for the new app
Acceptance: portal app builds standalone, `/` renders auth-required shell on
mobile+desktop, zero marketing runtime, no PHI.

## Slice 2 — OTP Auth *(human-gated; D3/D4; needs backend)*
Mobile-primary + email-fallback OTP via provider abstraction; `__Host-` cookie
session; CSRF + Origin validation; rotation; revoke; session list; step-up.
Backend: Identity & Access context (D2) issues sessions; no auto-merge.

## Slice 3 — Overview *(needs BFF reads)*
Identity summary, appointments, recent Rx/labs, outstanding bills, ABHA status,
pending consents — each with source/sync indicators.

## Slices 4–8 — Timeline · Encounters/Docs · Rx/Meds · Labs · Bills
Bills (D6): Razorpay Orders + Standard Checkout; server-authoritative confirm;
idempotent webhooks; reconciliation. Client never marks paid.

## Slice 9 — ABDM/Consent *(phased, D5, legal-gated)*
Internal records → ABHA sandbox → care-context → consent → external exchange →
prod after reviews. Adapter-isolated.

## Slice 10 — Privacy/Support
Configurable retention categories (legal approval flag, D7); data-rights;
grievance; sessions/devices; export.

## Cross-cutting
Capacity (D9): provisional engineering assumptions + small-clinic/hospital/
network load profiles, load-tested before prod. Object-level authz + provenance
+ no-PHI-in-logs/URLs/cache every slice. Tests required (DoD).
