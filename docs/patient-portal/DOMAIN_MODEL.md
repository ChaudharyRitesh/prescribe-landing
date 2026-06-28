# Domain Model — Patient Portal

Bounded contexts (no single god `PatientRecord`). Each clinical record carries
a **provenance envelope**.

## Provenance envelope (every record)
`internalRecordId · patientId · sourceSystem · sourceFacility · sourceTenant ·
practitioner? · encounterId? · createdAt · authoredAt · updatedAt ·
recordStatus · verificationStatus · dataOrigin(kp_native | abdm_linked |
patient_uploaded | unverified) · consentRef? · version · supersededBy?`

## Contexts & key entities
- **Identity & Access**: PatientAccount (opaque id), LoginIdentity (phone/email, verified), Session, StepUpChallenge.
- **Patient Profile**: PatientProfile, EmergencyContact, dependents (later).
- **Patient–Facility Identity Mapping**: FacilityPatientLink (facilityId ↔ facility patient id), matchStatus.
- **Clinical Encounters**: Encounter (OPD/IPD), Admission, DischargeSummary.
- **Prescriptions / Medication**: Prescription, Medication, DispenseStatus, MedicationHistory.
- **Lab & Diagnostics**: LabOrder, LabReport, StructuredResult, ReferenceRange, AbnormalFlag.
- **Documents**: ClinicalDocument (typed, versioned), download authorization.
- **Appointments**: Appointment, Slot.
- **Billing & Payments**: Invoice, LineItem, Receipt, Payment, Refund, ReconciliationState.
- **Consent**: ConsentRequest, ConsentArtifact, ConsentHistory, lifecycle states.
- **ABDM Integration**: AbhaLink, CareContext, ConsentArtifact(ABDM), HiuRequest, normalized record + immutable source ref.
- **Notifications · Audit & Compliance · Support & Grievances**.

Seed types ported from `kaero-prescribe-frontend/src/patient_portal/types.ts`
(PatientUser, Appointment, Prescription, Medication, LabReport, Bill,
FamilyMember, OTP*). These are screen DTOs; domain entities add provenance +
lifecycle and live in `features/patient-portal/<context>/types`.

> Draft — expand per slice. Lifecycle state machines TBD in slice work.
