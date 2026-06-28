# Compliance Evidence Matrix — Patient Portal

No "compliant / certified / audit-ready / production-ready" claim without
evidence. Status per control.

| Control | Implemented | Tested | Documented | Needs legal | Needs ops | Needs external audit |
|---|---|---|---|---|---|---|
| OTP auth protections | ✗ | ✗ | ✓ (design) | — | — | — |
| HttpOnly cookie session, no localStorage PHI tokens | ✗ | ✗ | ✓ | — | — | — |
| Object-level authz / deny-by-default | ✗ (BFF) | ✗ | ✓ | — | ✓ | — |
| Tenant isolation preserved | partial (provider side) | ✗ | ✓ | — | ✓ | — |
| Consent enforcement | ✗ | ✗ | ✓ | ✓ | — | — |
| Provenance per record | ✗ | ✗ | ✓ | — | — | — |
| PHI not in logs/URLs/cache | ✗ | ✗ | ✓ | — | ✓ | — |
| Encryption in transit | ✓ (TLS) | partial | ✓ | — | — | — |
| Encryption at rest | unknown | ✗ | ✗ | — | ✓ | — |
| ABDM workflows | ✗ | ✗ | ✓ (design) | ✓ | ✓ | ✓ |
| Audit trail (privacy-safe) | partial | ✗ | ✓ | — | ✓ | — |
| Data-rights / erasure flows | ✗ | ✗ | ✓ | ✓ | — | — |

## Unsubstantiated marketing claims to avoid until evidence exists
"ABDM certified", "fully compliant", "secure", "production ready". Track real
status here, not in marketing copy.
