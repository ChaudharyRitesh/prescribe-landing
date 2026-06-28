# Observability — Patient Portal

Privacy-safe only. Correlation IDs + opaque IDs. No clinical content / direct
identifiers in telemetry.

## Signals
Auth success/failure rates, OTP delivery latency, rate-limit events, session
failures, API latency, query errors, aggregation failures, ABDM consent/sync
failures, payment reconciliation failures, document download failures,
background-job backlog, frontend errors, a11y regressions, suspicious access.

## Frontend
Privacy-safe event names; never log OTP/tokens/PHI/URLs-with-doc-ids; scrub
error-tracking breadcrumbs.

## Ops
Alerts + runbooks for auth, payments, ABDM, document delivery. Defined per slice
as endpoints land.
