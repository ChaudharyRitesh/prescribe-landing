export type RecordStatus = "active" | "completed" | "corrected" | "superseded" | "unavailable";

export type RecordSourceType = "kaero-prescribe" | "facility" | "abdm" | "patient-upload";

export interface IpAdmissionRecord {
  id: string;
  patientFacingReference: string;
  title: string;
  status: RecordStatus;

  source: {
    type: RecordSourceType;
    facilityName: string;
    lastUpdatedAt: string;
  };

  admission: {
    admittedAt: string;
    dischargedAt?: string;
    admissionType?: string;
  };

  attendingPractitioner?: {
    id: string;
    displayName: string;
    specialty?: string;
  };

  facility: {
    id: string;
    displayName: string;
    city?: string;
  };

  diagnosis?: {
    displayName: string;
    code?: string;
  };

  procedure?: {
    displayName: string;
    performedAt?: string;
  };

  bloodGroup?: string;

  clinicalSections: {
    presentingSymptoms?: string;
    findings?: string;
    procedureNote?: string;
    outcome?: string;
    dischargeInstructions?: string[];
  };

  medications: Array<{
    id: string;
    displayName: string;
    dose?: string;
    frequency?: string;
    route?: string;
  }>;

  billing?: {
    invoiceId: string;
    invoiceReference: string;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    status: string;
  };

  history: Array<{
    id: string;
    eventType: string;
    title: string;
    occurredAt: string;
    description?: string;
  }>;

  documents: Array<{
    id: string;
    title: string;
    type: string;
    mimeType: string;
    sizeBytes?: number;
    createdAt?: string;
    canDownload: boolean;
  }>;

  permissions: {
    canView: boolean;
    canDownloadSummary: boolean;
    canScheduleFollowUp: boolean;
    canViewBilling: boolean;
  };
}
