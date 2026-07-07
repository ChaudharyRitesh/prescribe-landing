# System Architecture — Patient Portal

Updated per D1–D6 (2026-06-28).

```
kaeroprescribe.com (marketing, prescribe-landing)   ── separate Vercel project
        (no PHI; Sanity/analytics/tag-managers stay here ONLY)

portal.kaeroprescribe.com  ── separate Vercel project, CSP, analytics, SW scope
  [apps/patient-portal]  Next app (own build/env/release/rollback)
    - portal-scoped MUI theme + QueryClient (in-memory PHI cache, clear on logout)
    - feature-modular features/<context>/{api,components,hooks,pages,schemas,types}
    - typed portal API client (cookie session) → BFF ONLY
        │  __Host- session cookie (HttpOnly, Secure, SameSite, Path=/, no Domain)
        │  CSRF token + Origin validation on mutations
        ▼
  [Patient-Access BFF]  (kaero-prescribe-backend, new context — not built)
    - authz orchestration, consent enforcement, aggregation, provenance,
      response shaping, redaction, short-lived doc auth, rate limit, audit
    - does NOT own identity
        ├──→ [Patient Identity & Access context]  (D2/ADR-008, backend)
        │       canonical opaque patient IDs · verified login identifiers ·
        │       facility patient mappings · duplicate/manual-review ·
        │       ABHA mappings · account recovery · session ownership · audit
        ├──→ [tenant provider APIs] (read, tenant-isolated)
        ├──→ [ABDM gateway] via adapters (phased, D5) — legal-gated
        └──→ [Payments] Razorpay Orders + Standard Checkout (D6)
                backend: verify invoice/amount → create Order → verify checkout
                signature → validate webhook signature → idempotent events →
                reconcile → prevent duplicate application. Client NEVER marks paid.
```

## Principles
- Frontend → BFF only; never tenant DBs directly.
- Identity is owned by the backend Identity & Access context, separate from the BFF (D2).
- BFF enforces tenant isolation + object-level patient ownership + consent (deny-by-default).
- Async workflows (ABDM sync, exports, doc gen, reconciliation) = explicit job states.
- Idempotency on payment/consent/linking; webhook replay protection.

## Slice 1 reality
`apps/patient-portal` shell only; BFF + identity + auth are escalated/gated. Real
PHI waits on the BFF. Session resolves unauthenticated (marked mock).
