# Information Architecture — Patient Portal

## Mobile (bottom nav, ≤5)
Home · Records · Appointments · Bills · Profile.
Consent reachable from Home/Records/Profile (no duplicated logic).

## Desktop (side nav)
Overview · Health Timeline · Visits · Prescriptions · Medicines ·
Lab & Diagnostic Reports · Documents · Appointments · Bills & Payments ·
Consents & ABHA · Profile & Privacy.

## Route map (Next app router, isolated group)
```
app/portal/
  layout.tsx            # portal providers + shell + guard
  page.tsx              # Overview
  (auth)/login          # OTP sign-in (Slice 2)
  records/              # timeline + record detail
  visits/               # OPD/IPD encounters
  prescriptions/
  medicines/
  lab-reports/
  documents/
  appointments/
  bills/
  consents/             # + ABHA
  profile/              # + privacy/data-rights/sessions
```

## Progressive disclosure
List → summary card → detail sheet (mobile bottom sheet / desktop drawer).
Status communicated by label + icon + color (never color alone).

> Validate against USER_JOURNEYS before building each section.
