# Product Requirements — Patient Portal

Authoritative requirements; mirror the engagement spec. Update with the code.

## Goal
Secure, mobile-first patient-facing portal to access available healthcare info
across KaeroPrescribe-connected facilities, with clear source/verification
status per record. Supports small clinics and large multi-location hospitals.

## In scope (record types)
Medical history, OPD/IPD encounters, diagnoses/notes (patient-visible),
prescriptions, medications, lab/diagnostic reports, procedures, discharge
summaries, bills/invoices/receipts/payments/refunds, appointments, facilities,
doctors, downloadable/shareable documents, ABDM/ABHA-linked records, consent
requests/history, account/privacy/data-rights controls.

## Record provenance states (must be visible)
kp_native · abdm_linked · awaiting_consent · awaiting_sync · link_failed ·
patient_uploaded · unverified. Each shows source, facility, date, type, status.

## Non-functional
Mobile-first, accessible (WCAG AA target), low-bandwidth tolerant, localization-
ready, calm/trustworthy UX, horizontal-scalable backend, privacy-by-design.

## Explicit non-goals (now)
No automated clinical interpretation/advice. No claim that all provider records
are auto-available. No promise that all records are deletable.

## MVP
Slice 1 Foundation → Slice 2 OTP auth → Slice 3 Overview → Rx/Labs/Bills
(native data). ABDM/consent + cross-facility timeline = later, legal-gated.
