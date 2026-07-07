# Risks & Open Questions — Patient Portal

Updated per stakeholder decisions D1–D9 (2026-06-28).

## Risks
| ID | Risk | Severity | Mitigation | Owner |
|----|------|----------|------------|-------|
| R1 | PHI app inside public marketing site | **Resolved** | D1: separate app `apps/patient-portal` on `portal.kaeroprescribe.com`, separate Vercel/CSP/analytics | eng |
| R2 | No backend patient-access/BFF service yet | High | BFF (ADR-005); Slice 1 frontend-only vs typed contract + marked mocks | backend |
| R3 | Incorrect patient identity merge across tenants | Critical | Identity & Access context (ADR-008); opaque IDs; **no auto-merge** on phone/email/demographics (D3); manual review | backend + legal |
| R4 | ABDM/ABHA absent; prod needs cert + legal | High | Phased + adapter-isolated (D5); human gate | legal + eng |
| R5 | Cookie session + CSRF on portal subdomain | **High** (was Med) | `__Host-` HttpOnly/Secure/SameSite/Path=/ no Domain; CSRF tokens; Origin validation; rotation; server-side revoke (D4) | eng + security |
| R6 | Cross-account TanStack cache leakage | **High** (was Med) | In-memory only; clear all on logout/account switch; cancel in-flight (AbortSignal) on context change; per-account query scoping | eng |
| R7 | Unsubstantiated compliance claims | High | COMPLIANCE_EVIDENCE_MATRIX; no claims w/o evidence (D7) | all |
| R8 | Identity ownership conflated with BFF | High | D2/ADR-008: identity owned by backend context, NOT the BFF | backend + security |
| R9 | Account-recovery abuse (takeover via recovery flow) | High | Verified-identifier recovery, step-up, rate limit, audit; no demographic-only recovery | backend + security |
| R10 | SIM-swap / phone-number takeover | High | Mobile OTP not sole factor for sensitive ops; step-up; recency checks; email fallback; anomaly detection | security |
| R11 | Sensitive-record publication (over-exposure) | High | Object-level authz, consent gating, redaction, policy-driven visibility; sensitive-type step-up | backend |
| R12 | Document caching (private docs cached publicly/CDN) | High | Short-lived signed URLs; `no-store`; never public/CDN cache PHI docs | eng |
| R13 | Telemetry/analytics PHI leakage | High | Privacy-safe event names; opaque IDs; scrub URLs/breadcrumbs; no PHI in logs | eng |
| R14 | Delegated/guardian access misuse | High | Separate approved capability; explicit consent + audit; not in MVP | legal + eng |
| R15 | Payment webhook replay / duplicate application | High | Signature validation, idempotent event processing, dedupe, reconciliation (D6) | backend |
| R16 | Record provenance loss / spoofed source | High | Provenance envelope per record; immutable source ref at BFF; never imply KP owns external records | backend |
| R17 | Broken object-level authorization (IDOR) | Critical | Deny-by-default, per-object ownership + consent checks at BFF; cross-patient/cross-tenant tests | backend + security |

## Open questions (status after D-series)
1. ~~Host repo~~ — **Resolved (D1)**: `apps/patient-portal`, `portal.kaeroprescribe.com`.
2. ~~Identity owner~~ — **Resolved (D2)**: backend Identity & Access context.
3. ~~Auth channel~~ — **Resolved (D3)**: mobile primary, email fallback.
4. ABDM sandbox credentials availability + timeline — **open** (D5 phased).
5. ~~Payment flow~~ — **Resolved (D6)**: Razorpay Orders + Standard Checkout, server-authoritative.
6. Final retention periods + privacy-notice wording — **open, legal-gated** (D7).
7. Capacity numbers — **open**; provisional engineering assumptions + load profiles (D9).
8. Vercel project + DNS for `portal.kaeroprescribe.com` — **open, devops gate**.
