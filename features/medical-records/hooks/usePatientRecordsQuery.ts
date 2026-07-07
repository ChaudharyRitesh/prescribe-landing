"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  PatientRecordListItem,
  RecordCategory,
  DateRange,
  RecordStatus,
} from "../types/medicalRecords.types";

// ---------- MOCK DATA ----------

const MOCK_RECORDS: PatientRecordListItem[] = [
  { id: "r01", title: "Complete Blood Count", recordType: "laboratory", categoryLabel: "Lab Report", recordDate: "2024-10-24", practitioner: { id: "p1", displayName: "Dr. Sarah Wilson", specialty: "Pathology" }, facility: { id: "f1", displayName: "Thyrocare Labs", city: "Bengaluru" }, source: "abdm", status: "new", recordReference: "REC-8421", canView: true, canDownload: true, canSelect: true },
  { id: "r02", title: "Annual Physical Examination", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-10-24", practitioner: { id: "p2", displayName: "Dr. Meera Sharma", specialty: "General Medicine" }, facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "completed", recordReference: "REC-8420", canView: true, canDownload: true, canSelect: true },
  { id: "r03", title: "Blood Panel Results", recordType: "laboratory", categoryLabel: "Lab Report", recordDate: "2024-10-15", practitioner: { id: "p3", displayName: "Dr. James Miller", specialty: "Pathology" }, facility: { id: "f1", displayName: "Thyrocare Labs", city: "Bengaluru" }, source: "abdm", status: "new", recordReference: "REC-8419", canView: true, canDownload: true, canSelect: true },
  { id: "r04", title: "Chest X-Ray Report", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-10-02", practitioner: { id: "p4", displayName: "Dr. Elena Rodriguez", specialty: "Radiology" }, facility: { id: "f3", displayName: "Apollo Diagnostics", city: "Bengaluru" }, source: "facility", status: "completed", recordReference: "REC-8418", canView: true, canDownload: true, canSelect: true },
  { id: "r05", title: "Dermatology Consultation", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-09-28", practitioner: { id: "p5", displayName: "Dr. Michael Chen", specialty: "Dermatology" }, facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "completed", recordReference: "REC-8417", canView: true, canDownload: true, canSelect: true },
  { id: "r06", title: "Vaccination Record", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-09-20", practitioner: { id: "p6", displayName: "Nurse Sarah", specialty: "Immunization" }, facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "completed", recordReference: "REC-8416", canView: true, canDownload: false, canSelect: true },
  { id: "r07", title: "Metformin 500mg Prescription", recordType: "prescription", categoryLabel: "Prescription", recordDate: "2024-09-15", practitioner: { id: "p2", displayName: "Dr. Meera Sharma", specialty: "General Medicine" }, facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "available", recordReference: "REC-8415", canView: true, canDownload: true, canSelect: true },
  { id: "r08", title: "Lipid Profile Test", recordType: "laboratory", categoryLabel: "Lab Report", recordDate: "2024-09-10", practitioner: { id: "p1", displayName: "Dr. Sarah Wilson", specialty: "Pathology" }, facility: { id: "f1", displayName: "Thyrocare Labs", city: "Bengaluru" }, source: "abdm", status: "completed", recordReference: "REC-8414", canView: true, canDownload: true, canSelect: true },
  { id: "r09", title: "Inpatient Admission — Appendectomy", recordType: "admission", categoryLabel: "Admission", recordDate: "2024-08-22", practitioner: { id: "p7", displayName: "Dr. Raj Patel", specialty: "General Surgery" }, facility: { id: "f4", displayName: "Manipal Hospital", city: "Bengaluru" }, source: "facility", status: "completed", recordReference: "REC-8413", canView: true, canDownload: true, canSelect: true },
  { id: "r10", title: "OPD Consultation — Follow-up", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-08-15", practitioner: { id: "p2", displayName: "Dr. Meera Sharma", specialty: "General Medicine" }, facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "completed", recordReference: "REC-8412", canView: true, canDownload: false, canSelect: true },
  { id: "r11", title: "Hospital Invoice — Surgery", recordType: "billing", categoryLabel: "Billing", recordDate: "2024-08-25", facility: { id: "f4", displayName: "Manipal Hospital", city: "Bengaluru" }, source: "facility", status: "available", recordReference: "REC-8411", canView: true, canDownload: true, canSelect: true },
  { id: "r12", title: "Thyroid Function Test", recordType: "laboratory", categoryLabel: "Lab Report", recordDate: "2024-08-05", practitioner: { id: "p1", displayName: "Dr. Sarah Wilson", specialty: "Pathology" }, facility: { id: "f1", displayName: "Thyrocare Labs", city: "Bengaluru" }, source: "abdm", status: "completed", recordReference: "REC-8410", canView: true, canDownload: true, canSelect: true },
  { id: "r13", title: "Amoxicillin Prescription", recordType: "prescription", categoryLabel: "Prescription", recordDate: "2024-07-30", practitioner: { id: "p2", displayName: "Dr. Meera Sharma", specialty: "General Medicine" }, facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "completed", recordReference: "REC-8409", canView: true, canDownload: true, canSelect: true },
  { id: "r14", title: "ECG Report", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-07-20", practitioner: { id: "p8", displayName: "Dr. Emily Vance", specialty: "Cardiology" }, facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "completed", recordReference: "REC-8408", canView: true, canDownload: true, canSelect: true },
  { id: "r15", title: "Urine Analysis", recordType: "laboratory", categoryLabel: "Lab Report", recordDate: "2024-07-15", practitioner: { id: "p3", displayName: "Dr. James Miller", specialty: "Pathology" }, facility: { id: "f1", displayName: "Thyrocare Labs", city: "Bengaluru" }, source: "abdm", status: "available", recordReference: "REC-8407", canView: true, canDownload: true, canSelect: true },
  { id: "r16", title: "Eye Examination Report", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-07-10", practitioner: { id: "p9", displayName: "Dr. Robert Fox", specialty: "Ophthalmology" }, facility: { id: "f5", displayName: "Narayana Nethralaya", city: "Bengaluru" }, source: "facility", status: "completed", recordReference: "REC-8406", canView: true, canDownload: false, canSelect: false },
  { id: "r17", title: "Discharge Summary — ICU", recordType: "admission", categoryLabel: "Admission", recordDate: "2024-06-25", practitioner: { id: "p7", displayName: "Dr. Raj Patel", specialty: "General Surgery" }, facility: { id: "f4", displayName: "Manipal Hospital", city: "Bengaluru" }, source: "facility", status: "completed", recordReference: "REC-8405", canView: true, canDownload: true, canSelect: true },
  { id: "r18", title: "Pharmacy Invoice — Monthly", recordType: "billing", categoryLabel: "Billing", recordDate: "2024-06-20", facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "completed", recordReference: "REC-8404", canView: true, canDownload: true, canSelect: true },
  { id: "r19", title: "HbA1c Test", recordType: "laboratory", categoryLabel: "Lab Report", recordDate: "2024-06-15", practitioner: { id: "p1", displayName: "Dr. Sarah Wilson", specialty: "Pathology" }, facility: { id: "f1", displayName: "Thyrocare Labs", city: "Bengaluru" }, source: "abdm", status: "completed", recordReference: "REC-8403", canView: true, canDownload: true, canSelect: true },
  { id: "r20", title: "Paracetamol Prescription", recordType: "prescription", categoryLabel: "Prescription", recordDate: "2024-06-10", practitioner: { id: "p2", displayName: "Dr. Meera Sharma", specialty: "General Medicine" }, facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "superseded", recordReference: "REC-8402", canView: true, canDownload: false, canSelect: false },
  { id: "r21", title: "MRI Brain Scan", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-05-28", practitioner: { id: "p10", displayName: "Dr. Anita Desai", specialty: "Neurology" }, facility: { id: "f4", displayName: "Manipal Hospital", city: "Bengaluru" }, source: "facility", status: "pending", recordReference: "REC-8401", canView: false, canDownload: false, canSelect: false },
  { id: "r22", title: "Vitamin D Test", recordType: "laboratory", categoryLabel: "Lab Report", recordDate: "2024-05-20", practitioner: { id: "p3", displayName: "Dr. James Miller", specialty: "Pathology" }, facility: { id: "f1", displayName: "Thyrocare Labs", city: "Bengaluru" }, source: "abdm", status: "completed", recordReference: "REC-8400", canView: true, canDownload: true, canSelect: true },
  { id: "r23", title: "Consultation Invoice", recordType: "billing", categoryLabel: "Billing", recordDate: "2024-05-15", facility: { id: "f2", displayName: "Kaero Multispeciality Clinic", city: "Bengaluru" }, source: "kaero-prescribe", status: "available", recordReference: "REC-8399", canView: true, canDownload: true, canSelect: true },
  { id: "r24", title: "Dental Check-up Report", recordType: "clinical", categoryLabel: "Clinical Record", recordDate: "2024-05-01", practitioner: { id: "p11", displayName: "Dr. Priya Menon", specialty: "Dentistry" }, facility: { id: "f6", displayName: "Clove Dental", city: "Bengaluru" }, source: "patient-upload", status: "available", recordReference: "REC-8398", canView: true, canDownload: true, canSelect: true },
];

const PAGE_SIZE = 10;

// ---------- HOOK ----------

export type UsePatientRecordsQueryParams = {
  category: RecordCategory;
  search: string;
  dateRange: DateRange;
  status: RecordStatus | "all";
  page: number;
};

export const usePatientRecordsQuery = (params: UsePatientRecordsQueryParams) => {
  const [data, setData] = useState<PatientRecordListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const t = setTimeout(() => {
      if (controller.signal.aborted) return;

      let filtered = [...MOCK_RECORDS];

      // Category
      if (params.category !== "all") {
        filtered = filtered.filter((r) => r.recordType === params.category);
      }

      // Search
      if (params.search.trim()) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.facility.displayName.toLowerCase().includes(q) ||
            r.practitioner?.displayName.toLowerCase().includes(q) ||
            r.recordReference?.toLowerCase().includes(q)
        );
      }

      // Date range
      if (params.dateRange !== "all") {
        const now = Date.now();
        const msMap: Record<string, number> = {
          "30d": 30 * 86400000,
          "3m": 90 * 86400000,
          "6m": 180 * 86400000,
          "12m": 365 * 86400000,
        };
        const cutoff = now - (msMap[params.dateRange] || 0);
        filtered = filtered.filter((r) => new Date(r.recordDate).getTime() >= cutoff);
      }

      // Status
      if (params.status !== "all") {
        filtered = filtered.filter((r) => r.status === params.status);
      }

      setTotalCount(filtered.length);

      // Pagination
      const start = (params.page - 1) * PAGE_SIZE;
      setData(filtered.slice(start, start + PAGE_SIZE));
      setIsLoading(false);
    }, 600);

    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [params.category, params.search, params.dateRange, params.status, params.page]);

  return {
    data,
    totalCount,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    pageSize: PAGE_SIZE,
    isLoading,
    error,
    refetch: useCallback(() => {
      setIsLoading(true);
      setError(null);
    }, []),
  };
};
