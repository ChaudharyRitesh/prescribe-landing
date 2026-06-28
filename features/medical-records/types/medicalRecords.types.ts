export type RecordType =
  | "clinical"
  | "prescription"
  | "laboratory"
  | "admission"
  | "billing";

export type RecordSource =
  | "kaero-prescribe"
  | "facility"
  | "abdm"
  | "patient-upload";

export type RecordStatus =
  | "new"
  | "available"
  | "completed"
  | "pending"
  | "corrected"
  | "superseded"
  | "unavailable";

export type PatientRecordListItem = {
  id: string;
  title: string;
  recordType: RecordType;
  categoryLabel: string;
  recordDate: string;
  practitioner?: {
    id: string;
    displayName: string;
    specialty?: string;
  };
  facility: {
    id: string;
    displayName: string;
    city?: string;
  };
  source: RecordSource;
  status: RecordStatus;
  recordReference?: string;
  canView: boolean;
  canDownload: boolean;
  canSelect: boolean;
};

export type RecordCategory = "all" | RecordType;

export type DateRange =
  | "all"
  | "30d"
  | "3m"
  | "6m"
  | "12m";

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  all: "All time",
  "30d": "Last 30 days",
  "3m": "Last 3 months",
  "6m": "Last 6 months",
  "12m": "Last 12 months",
};

export const STATUS_LABELS: Record<RecordStatus, string> = {
  new: "New",
  available: "Available",
  completed: "Completed",
  pending: "Pending",
  corrected: "Corrected",
  superseded: "Superseded",
  unavailable: "Unavailable",
};

export const CATEGORY_LABELS: Record<RecordCategory, string> = {
  all: "All Records",
  clinical: "Clinical Records",
  prescription: "Prescriptions",
  laboratory: "Lab Reports",
  admission: "Admissions",
  billing: "Billing",
};

export type RecordFiltersState = {
  category: RecordCategory;
  search: string;
  dateRange: DateRange;
  status: RecordStatus | "all";
  page: number;
};

export type ExportStatus =
  | "idle"
  | "submitting"
  | "processing"
  | "ready"
  | "failed"
  | "expired";
