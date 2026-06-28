# API Contracts — Patient Portal (BFF)

Status: **Proposed / undefined backend.** Frontend codes against these typed
contracts; Slice 1 uses clearly-marked mock adapters. Do not present mocks as
production.

## Conventions
- Base: `/portal/v1` on the Patient-Access BFF.
- Cookie session (HttpOnly). CSRF token header on mutations.
- Cursor pagination (`?cursor=&limit=`), filtering, date ranges, sorting.
- Envelope: `{ data, page?: { nextCursor }, partialFailures?: [...] }`.
- Idempotency-Key header on payment/consent/linking.
- Every clinical item includes the provenance envelope (DOMAIN_MODEL).

## Endpoints (draft)
```
POST /auth/otp/request        { channel:"phone"|"email", value }     -> { challengeId, cooldownSec }
POST /auth/otp/verify         { challengeId, otp }                    -> sets cookie; { patientId(opaque) }
POST /auth/logout
GET  /me/summary                                                     -> overview aggregate
GET  /timeline?cursor&types&facility&from&to                        -> records[] (provenance)
GET  /prescriptions / /prescriptions/:id
GET  /lab-reports / /lab-reports/:id
GET  /encounters / /encounters/:id
GET  /documents/:id/download    (short-lived signed URL)
GET  /invoices / /invoices/:id ; GET /payments
POST /payments/:invoiceId/intent  (Idempotency-Key)
GET  /consents ; POST /consents/:id/respond ; POST /consents/:id/revoke
GET  /abha/link-status ; POST /abha/link
GET  /sessions ; DELETE /sessions/:id
```
> Produce OpenAPI before backend build. Authorization behaviour validated server-side.
