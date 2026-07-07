# Security Threat Model — Patient Portal

Draft (STRIDE-lite). Expand before Slice 2 (auth) ships.

## Trust boundaries
Browser ↔ /portal ↔ Patient-Access BFF ↔ tenant APIs / ABDM / payments.
PHI app co-located with public marketing site → boundary R1 (RISKS).

## Key threats & controls
- **Spoofing**: OTP brute force/enumeration → short-lived one-time hashed OTP, attempt limits, resend cooldown, IP/device throttle, generic responses, no account-existence disclosure.
- **Tampering**: idempotency on payment/consent/linking; server-side authoritative state.
- **Repudiation**: audit trail w/ correlation IDs, opaque IDs.
- **Info disclosure**: object-level authz, tenant isolation, consent checks, redaction; PHI never in logs/URLs/analytics/breadcrumbs; in-memory cache cleared on logout; secure document delivery (short-lived auth).
- **DoS**: rate limiting, backpressure, circuit breakers on ABDM/payments.
- **Elevation**: deny-by-default, least privilege, step-up verification for high-risk actions.

## Session (D4)
OTP login; **`__Host-` cookie**: HttpOnly, Secure, explicit SameSite, `Path=/`,
**no `Domain`** (host-only on `portal.kaeroprescribe.com`). CSRF tokens + Origin
validation on mutations; rotate on auth; server-side revoke; device/session list;
step-up for sensitive ops. CSP scoped to the portal app (separate from marketing).

## Added threats (per decisions) & controls
- **Account recovery abuse (R9)**: verified-identifier recovery only; step-up; rate-limit; audit; no demographic-only recovery.
- **SIM-swap / phone takeover (R10)**: mobile OTP not sole factor for sensitive actions; recency/anomaly checks; email fallback; step-up.
- **Sensitive-record over-exposure (R11)**: object-level authz, consent gating, redaction, policy-driven visibility, sensitive-type step-up.
- **Document caching (R12)**: short-lived signed URLs, `Cache-Control: no-store`, never public/CDN cache PHI docs.
- **Telemetry leakage (R13)**: privacy-safe event names, opaque IDs, scrub URLs/breadcrumbs.
- **Delegated/guardian access (R14)**: separate approved capability; explicit consent + audit; not MVP.
- **Webhook replay / duplicate payment (R15)**: signature validation + idempotent event processing + dedupe + reconciliation.
- **Provenance spoofing (R16)**: provenance envelope + immutable source ref; never imply KP owns external records.
- **IDOR / broken object-level authz (R17)**: deny-by-default; per-object ownership + consent checks; cross-patient + cross-tenant denial tests.
- **Identity ≠ BFF (R8)**: canonical identity owned by backend Identity & Access context, not the BFF.
- **No auto-merge (D3)**: never merge patients on matching phone/email/demographics.

## Never log/transmit in telemetry
OTP, tokens, ABHA creds, full Rx/lab content, diagnoses, notes, unredacted doc
URLs, payment creds, gov IDs.
