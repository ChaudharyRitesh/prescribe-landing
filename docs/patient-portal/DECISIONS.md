# Architecture Decision Records — Patient Portal

ADR format: Context → Decision → Status → Consequences.

## ADR-001 — Host the Patient Portal in `prescribe-landing` — **SUPERSEDED by ADR-007 (D1)**
~~Build under `prescribe-landing` `app/portal/**`.~~ Reversed by stakeholder
decision D1 (2026-06-28): the portal must NOT run inside the marketing app.
See ADR-007.

## ADR-002 — Hard isolation inside a public site — **SUPERSEDED by ADR-007 (D1)**
Co-location rejected; replaced by physical app + deploy isolation (ADR-007).

## ADR-007 — (D1) Portal is a separate app/deploy on `portal.kaeroprescribe.com`
**Context.** Co-locating PHI inside the marketing Next app (ADR-001/002) is rejected by D1.
**Decision.** `kaeroprescribe.com` = marketing; `portal.kaeroprescribe.com` = authenticated portal. Portal lives at `apps/patient-portal` (may share the monorepo) with **separate** Vercel project, build/deploy, env vars, CSP, analytics, error-monitoring, service-worker scope, release/rollback. Marketing scripts/Sanity/tag-managers/analytics MUST NOT be in the portal runtime.
**Status.** Accepted (D1). Slice 1 relocated out of `app/portal/**` into `apps/patient-portal`.
**Consequences.** Clean PHI boundary; some duplicated shell/providers; new Vercel project + DNS for the subdomain (human/devops gate before prod).

## ADR-008 — (D2) Patient Identity & Access bounded context in the backend
**Decision.** Canonical patient identity lives in a new **Patient Identity & Access** module in `kaero-prescribe-backend` (logical module + schema isolation, not a separate microservice yet). It owns opaque patient IDs, verified login identifiers, facility patient mappings, duplicate-patient + manual-review workflows, ABHA mappings, account recovery, session ownership, identity-linking audit. The **Patient-Access BFF does NOT own identity** — it does aggregation, authz orchestration, consent enforcement, response shaping.
**Status.** Accepted (D2). Migration = human-gated.

## ADR-009 — (D3) Auth: mobile OTP primary, email OTP fallback, provider abstraction
**Decision.** Both mobile + email OTP; mobile primary. OTP-provider abstraction (SMS/email/dev swappable). Phone/email/ABHA/facility-id are **never** universal primary keys. **No auto-merge** of patient records on matching phone/email/demographics.
**Status.** Accepted (D3). Backend work = Slice 2, gated.

## ADR-010 — (D4) Sessions: `__Host-` host-only secure cookie
**Decision.** Session cookie on `portal.kaeroprescribe.com`: `HttpOnly`, `Secure`, explicit `SameSite`, `Path=/`, **no `Domain`**, prefer `__Host-` prefix. Plus CSRF protection, Origin validation, session rotation, server-side revocation, step-up for sensitive ops.
**Status.** Accepted (D4).

## ADR-011 — (D5) ABDM phased, non-blocking, adapter-isolated
**Decision.** MVP = internal KP records only. Phases: ABHA sandbox → care-context → consent → external exchange → prod after reviews. Always behind adapters. Never claim auto-availability of all provider records.
**Status.** Accepted (D5).

## ADR-012 — (D6) Payments: Razorpay Orders + Standard Checkout, server-authoritative
**Decision.** Backend verifies invoice+amount, creates Order, verifies checkout signature, validates webhook signature, processes events idempotently, reconciles final state, prevents duplicate application. Frontend **never** marks paid on client callback alone.
**Status.** Accepted (D6). Activation gated.

## ADR-013 — (D7) Retention/privacy: configurable + legal-gated, no unproven claims
**Decision.** Retention as **configurable categories** marked "requires legal approval". No "DPDP compliant / ABDM ready / secure / certified" without evidence in COMPLIANCE_EVIDENCE_MATRIX.
**Status.** Accepted (D7).

## ADR-014 — (D8) Existing `patient_portal`: audit + incremental migrate, no wholesale copy
**Decision.** Reuse only validated journeys, domain behaviour, API contracts, accessible components, tests, design tokens. New isolated shell; migrate accepted functionality incrementally. Do not bulk-copy into the marketing app.
**Status.** Accepted (D8). Supersedes ADR-003's "port into prescribe-landing" framing.

## ADR-015 — (D9) Capacity: provisional engineering assumptions, load-profile validated
**Decision.** Don't block foundation on business numbers. Configurable provisional assumptions marked "engineering assumption, not business commitment". Build small-clinic / hospital / hospital-network load profiles; validate via load test before prod.
**Status.** Accepted (D9).

## ADR-003 — Reuse, don't duplicate, the reference `patient_portal/`
**Decision.** Audit the tenant app's `src/patient_portal/` as the UX/domain reference; port domain types + screen flows into the portal feature modules. Do not fork its Redux-saga data layer.
**Status.** Accepted.
**Consequences.** Faster UX; domain types (`PatientUser`, `Prescription`, `Bill`, …) seed `features/patient-portal/**/types`.

## ADR-004 — TanStack Query as the portal server-state layer (portal-scoped)
**Context.** Spec mandates TanStack Query exclusively. Tenant app uses Redux-saga. `prescribe-landing` already uses TanStack.
**Decision.** Use TanStack Query for all portal server-state via query-key factories + custom hooks. No Redux/Zustand for server data. Client state via component/URL/context/form only.
**Status.** Accepted.
**Consequences.** Consistent with spec and host repo; no new global-state dependency.

## ADR-005 — A Patient-Access / BFF service is required (backend, not built yet)
**Context.** Tenant APIs are provider-centric; portal must not aggregate across tenant DBs from the browser.
**Decision.** Introduce a backend Patient-Access service owning authz, consent, identity resolution, aggregation, provenance, ABDM. Portal calls only this service.
**Status.** Proposed — **escalated** (net-new backend, identity/consent model, legal review). Not in Slice 1.
**Consequences.** Slice 1 ships frontend foundation against a typed contract + mock adapters clearly marked; real data waits on the BFF.

## ADR-006 — Patient auth: OTP-only, cookie session (not localStorage)
**Decision.** Patient login = phone/email OTP; session via secure HttpOnly cookie. Do **not** reuse the staff `partner_token` localStorage pattern for PHI.
**Status.** Proposed — **escalated** (net-new backend auth + security gate). Slice 1 builds the client boundary; Slice 2 needs backend.
