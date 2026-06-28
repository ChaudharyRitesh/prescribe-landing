# Progress Log — Patient Portal

Newest first. Evidence-based; no "done" without verification output.

## 2026-06-28 — Slice 0 Discovery
- Verified estate: 3 repos, stacks, existing `patient_portal/` (tenant app), backend gaps.
- Confirmed absent: patient self-auth, ABDM/ABHA, patient-access/aggregation service, patient consent model.
- Created `docs/patient-portal/` with discovery + loop-state artifacts and ADR-001..006.
- Stakeholder decisions recorded: host=`prescribe-landing`, extend reference portal, TanStack portal-scoped, scope=docs+Slice 1.
- Commands: `grep`/`ls` repo inspection; dependency dumps; route/model audits.
- Limitations: capacity numbers unknown; backend contracts undefined (mocks will be marked).
- Next: Slice 1 Foundation in `app/portal/**`.

## 2026-06-28 — Slice 1 Foundation (implemented, verified by typecheck + build)
Files created:
- `features/patient-portal/shared/types/index.ts` — provenance envelope, session, paginated, portal error
- `features/patient-portal/shared/api/{client,errors,queryKeys}.ts` — portal-scoped axios client (cookie, no localStorage token), error translation + non-retryable classifier, opaque-id query-key factory
- `features/patient-portal/shared/hooks/usePortalSession.ts` — session query (Slice-1 mock → unauthenticated; marked TODO Slice 2)
- `features/patient-portal/shared/theme.ts` — portal MUI theme (calm)
- `features/patient-portal/shared/components/{PortalProviders,AppShell,states}.tsx` — PHI-safe QueryClient (in-memory, retry guard), responsive shell (desktop drawer + mobile bottom nav), Skeleton/Empty/Error/PermissionDenied/AuthRequired states
- `app/portal/layout.tsx` + `app/portal/{page,records,appointments,bills,profile,login}/page.tsx` — isolated route group, auth-guarded, full states

Evidence:
- `npx tsc --noEmit` → **No errors found** (strict mode)
- `npm run build` → **success**; routes generated as static: `/portal`, `/portal/records`, `/portal/appointments`, `/portal/bills`, `/portal/profile`, `/portal/login`
- Pre-existing unrelated build noise: careers page "Failed to fetch jobs" (network fetch at prerender) — not portal code.

Limitations / follow-ups:
- No test runner configured in repo yet → unit/component tests deferred (TEST_STRATEGY notes adding Vitest+RTL+jest-axe as next task). **Slice 1 has no automated tests yet** — not "done" per spec DoD until added.
- Browser/responsive visual check deferred: local Next dev server would not persist under the preview harness in this environment.
- Session is mock-unauthenticated (BFF absent, ADR-005); real data + OTP auth = Slice 2 (backend escalation).
- `NEXT_PUBLIC_PORTAL_API_URL` not yet set; client falls back to `/portal/v1`.

Next: stakeholder sign-off on RISKS open questions; then Slice 2 (needs backend) or add test harness to close Slice 1 DoD.

## 2026-06-28 — Decisions D1–D9 applied + Slice 1 relocated to `apps/patient-portal`
Docs updated: DECISIONS (ADR-001/002 superseded; ADR-007..015 added), RISKS
(R1 resolved; R5/R6 → High; R8–R17 added), SYSTEM_ARCHITECTURE (separate app +
Identity & Access context + Razorpay + `__Host-` session), SECURITY_THREAT_MODEL
(cookie/CSRF/recovery/SIM-swap/doc-cache/telemetry/webhook-replay/IDOR),
IMPLEMENTATION_PLAN (relocation + phased ABDM + payments + identity).

Relocation (D1):
- Removed portal from marketing tree: deleted `app/portal/**` + `features/patient-portal/**`; excluded `apps` from marketing tsconfig.
- Created isolated app `apps/patient-portal/`: own package.json/tsconfig/next.config (scoped CSP + security headers, no Sanity/analytics), `.env.example` (NEXT_PUBLIC_PORTAL_API_URL), `.gitignore`, root `app/layout.tsx` + routes `/ /records /appointments /bills /profile /login`, and `features/patient-portal/shared/**` (types, api client+errors+queryKeys, session hook, theme, states, AppShell, providers). Routes are top-level (no `/portal` prefix — runs at subdomain root).

Evidence:
- Marketing: `tsc --noEmit` → No errors; `npm run build` → success; **no `/portal` routes** (clean removal, no regression).
- Portal app: `npm install` (130 pkgs); `tsc --noEmit` → **No errors** (strict); `npm run build` → **Compiled successfully**, static routes `/ /appointments /bills /login /profile /records`.

Limitations / gates (unchanged):
- No automated tests yet (DoD open) — add Vitest+RTL+jest-axe next.
- Session still mock-unauthenticated; real auth = Slice 2 (Identity & Access context, ADR-008/009/010, human-gated).
- Vercel project + DNS for `portal.kaeroprescribe.com` = devops gate (not done).
- Nothing committed/deployed.

Next: (a) add test harness to close Slice 1 DoD, or (b) design BFF + Identity & Access + OTP/session contracts for Slice 2 (backend, gated).
