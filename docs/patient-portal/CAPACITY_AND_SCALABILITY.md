# Capacity & Scalability — Patient Portal

**No invented traffic claims.** Numbers below are explicit, configurable
**assumptions** pending stakeholder data + load testing.

## Assumptions (PLACEHOLDER — validate)
| Metric | Assumption | Source |
|--------|-----------|--------|
| Registered patients | unknown | TBD stakeholder |
| MAU | unknown | TBD |
| Peak concurrent sessions | unknown | TBD |
| OTP request rate | unknown | TBD |
| Records / patient | unknown | TBD |
| Documents / patient | unknown | TBD |
| ABDM callback volume | unknown | TBD |
| Peak billing events | unknown | TBD |
| Export-job volume | unknown | TBD |

## Scaling approach
Cursor pagination, index-aware queries, background jobs, idempotent consumers,
bounded retries + dead-letter, cache controls, CDN for **non-sensitive static
assets only**, short-lived auth for protected docs, backpressure, circuit
breakers on ABDM/payments, integration-failure monitoring. **Never cache private
medical documents publicly.** Horizontal scaling at the BFF.

> Propose load testing once endpoints exist. Do not present assumptions as facts.
