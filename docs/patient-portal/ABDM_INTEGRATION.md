# ABDM / ABHA Integration — Patient Portal

Status: **Not implemented anywhere (verified).** External bounded context via
adapters. Legal + human gate before any production activation.

## Adapter interfaces (BFF, future)
ABHA linking · patient discovery · care-context linking · consent
request/approve/deny/revoke · HIP + HIU workflows · record fetch + ack · retry/
reconciliation · webhook/callback processing · error translation.

## UI states (must all exist)
ABHA not linked · linking started · verification required · linked · partially
linked · consent requested/granted/denied/expired/revoked · retrieval in
progress · synchronized · sync failed · provider unavailable · user action
required.

## Rules
- Never imply KP owns provider-supplied records; preserve provenance.
- Never expose raw ABDM/FHIR payloads to UI; normalize, keep immutable source ref for audit/reconciliation.
- Decouple React + core domain entities from raw responses.

> Blocked on sandbox credentials + legal. Tracked in RISKS R4.
