# Patient Portal — Discovery Assessment

Status: **Draft (discovery only — no broad implementation yet)**
Repo: `prescribe-landing` (per stakeholder decision, 2026-06-28)
Author: architecture loop

> This document is the consolidated output of the spec's "FIRST ACTION:
> discovery only" step: current-state assessment, gap analysis, proposed
> domain boundaries, architecture, journeys, MVP scope, risks, sequence.
> Companion files in this directory hold the detailed cuts.

---

## 1. Current-state assessment (verified, not assumed)

### Repositories in the KaeroPrescribe estate
| Repo | Role | Stack | Relevance |
|------|------|-------|-----------|
| `prescribe-landing` (this) | Marketing + onboarding, `kaeroprescribe.com` (Vercel) | Next 16 (app router), React 19, Tailwind + Radix/shadcn, Sanity CMS, **MUI 7**, **@tanstack/react-query 5**, RHF, Zod, axios, Supabase auth, input-otp, react-phone-number-input, react-razorpay, nodemailer | **Chosen host for the Patient Portal** |
| `kaero-prescribe-frontend` | Tenant clinical app (staff) | Vite, React 18, MUI 7, react-router 7, Redux-Toolkit + redux-saga, axios | Holds existing `src/patient_portal/` (reference UI) |
| `kaero-prescribe-backend` (Desktop) | Multi-tenant API | Express, Mongoose, TS, per-tenant DB models | Source of clinical truth; OTP/SMS/email utils present |

### What already exists and is reusable
- **prescribe-landing infra**: `app/providers.tsx` (TanStack `QueryClientProvider` + MUI `ThemeProvider` + `@/theme`); `lib/api/axios.ts` (`apiClient`, `withCredentials`, response-unwrap + standardized errors); `app/partner/dashboard/*` (a working authenticated MUI dashboard area = pattern to follow); Supabase auth callback at `app/auth/callback`.
- **Reference patient UI** in `kaero-prescribe-frontend/src/patient_portal/`: Login, Dashboard, MedicalRecords, LabReports, PrescriptionHistory, BillPayments, AppointmentBooking, ProfileSettings, FamilyMembers + a rich `types.ts` (PatientUser, Appointment, Prescription, Medication, LabReport, Bill, FamilyMember, OTPRequest/Verify). **Phone-OTP is already modeled.**
- **Backend**: `otpService.ts`, `smsService.ts`, `emailService.ts`, `patientController`, `patientRoutes`, `rateLimiter.ts`. Pharmacy GST invoice (this session) on `Invoice` with `sellerSnapshot`/GST breakup.

### What does NOT exist (verified absent)
- **Patient self-service auth.** `patientRoutes` `/request-action-otp` is `authorize('TENANT_ADMIN','STAFF_ADMIN')` — staff action-OTP, not patient login. No patient session/identity service.
- **ABDM / ABHA** — zero code in backend or any frontend.
- **FHIR** — none.
- **Cross-facility patient-access aggregation service** — none. Backend is provider/tenant-centric.
- **Consent model for patients** — only staff-side `ConsentAuditLog` exists (HIPAA/DPDP staff trail), not patient-facing consent.

---

## 2. Gap analysis (spec requirement → current → gap)

| Spec area | Current | Gap |
|---|---|---|
| Patient OTP login (phone/email), HttpOnly cookie session | none (staff JWT in localStorage) | **Net-new backend** patient identity + OTP self-login + cookie session |
| Opaque patient identity, identity matching/linking | tenant-scoped `Patient` per DB | **New cross-tenant patient identity service** |
| Aggregation across facilities w/ consent + provenance | none | **New patient-access / BFF service** |
| TanStack Query, query-key factories, custom hooks | landing has TanStack; portal not built | Build portal-scoped query layer |
| MUI centralized theme | landing `@/theme` exists | Extend / portal theme tokens |
| ABDM adapters + consent center | none | **Large net-new bounded context (legal-gated)** |
| Provenance on every record (source/facility/status) | not modeled patient-side | New normalized record model + envelope |
| Privacy/consent/data-rights flows | none patient-side | New |
| Bills/payments (idempotent, refunds, reconciliation) | pharmacy + pathlab invoices exist server-side | Aggregate + patient-safe read; payment redirect |
| Observability / audit (privacy-safe) | partial server audit | Portal telemetry boundary |

---

## 3. Proposed domain boundaries (bounded contexts)
Identity & Access · Patient Profile · Patient–Facility Identity Mapping · Clinical Encounters (OPD/IPD) · Prescriptions · Medication · Lab & Diagnostics · Documents · Appointments · Billing & Payments · Consent · ABDM Integration · Notifications · Audit & Compliance · Support & Grievances.

See `DOMAIN_MODEL.md`.

## 4. Proposed architecture (summary)
- **Frontend**: `prescribe-landing` `app/portal/**` route group, isolated from marketing (own layout, own auth boundary, own MUI theme scope, own QueryClient config — PHI cache in-memory only, cleared on logout). Feature-modular `features/patient-portal/<context>/{api,components,hooks,pages,schemas,types}`.
- **Backend**: a **Patient-Access service / BFF** is required between the portal and the provider-centric tenant APIs; it owns authz, consent enforcement, identity resolution, aggregation, provenance, ABDM. Portal frontend never queries tenant DBs directly. (Not built in Slice 1.)
- See `SYSTEM_ARCHITECTURE.md`.

## 5. Patient journeys (MVP set)
Sign in via phone/email OTP → land on Overview → view a prescription → view a lab report → view/pay a bill → manage profile/consent → log out (cache cleared). Full set in `USER_JOURNEYS.md`.

## 6. MVP vs later
- **MVP (now-ish)**: Slice 1 Foundation (shell, theme, routing, typed API client, query provider, states, a11y). Then Slice 2 OTP auth (needs backend), Slice 3 Overview, Slices 6–8 (Rx, labs, bills — KaeroPrescribe-native data).
- **Later / legal-gated**: ABDM/ABHA + consent center (Slice 9), cross-facility timeline (Slice 4), record export, dependent/guardian access.

## 7. Risk register → see `RISKS_AND_OPEN_QUESTIONS.md`.
## 8. Implementation sequence → see `IMPLEMENTATION_PLAN.md`.
