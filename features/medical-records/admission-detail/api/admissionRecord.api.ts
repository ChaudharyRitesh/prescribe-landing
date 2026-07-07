import type { IpAdmissionRecord } from "../types/admissionRecord.types";

const MOCK_RECORD_ADM_88219: IpAdmissionRecord = {
  id: "adm-88219",
  patientFacingReference: "8219",
  title: "IPD Admission: Appendectomy",
  status: "completed",
  source: {
    type: "facility",
    facilityName: "Kaero Multispeciality Hospital",
    lastUpdatedAt: "2023-10-15T10:30:00Z",
  },
  admission: {
    admittedAt: "2023-10-12T08:00:00Z",
    dischargedAt: "2023-10-15T14:00:00Z",
    admissionType: "Emergency",
  },
  attendingPractitioner: {
    id: "prac-1",
    displayName: "Dr. Meera Sharma",
    specialty: "General Surgery",
  },
  facility: {
    id: "fac-1",
    displayName: "Kaero Multispeciality Hospital",
    city: "Bengaluru",
  },
  diagnosis: {
    displayName: "Acute appendicitis",
    code: "K35.80",
  },
  procedure: {
    displayName: "Laparoscopic appendectomy",
    performedAt: "2023-10-12T11:00:00Z",
  },
  bloodGroup: "O Positive",
  clinicalSections: {
    presentingSymptoms:
      "Patient presented to the ER with severe, sharp abdominal pain in the right lower quadrant that began 12 hours prior. Pain was accompanied by nausea, vomiting, and a low-grade fever. Rebound tenderness noted at McBurney's point.",
    findings:
      "Ultrasound of the abdomen revealed an enlarged, non-compressible appendix measuring 9mm in diameter with surrounding fluid, consistent with acute appendicitis. White blood cell count elevated at 15.2 K/uL.",
    procedureNote:
      "The patient underwent an uncomplicated laparoscopic appendectomy under general anesthesia. The appendix was found to be acutely inflamed and was removed successfully. No signs of perforation or abscess formation. Hemostasis achieved.",
    outcome:
      "The patient recovered well post-operatively. Bowel function returned on post-op day 1. Patient was able to tolerate a regular diet and pain was well-controlled with oral medications.",
    dischargeInstructions: [
      "Keep the surgical incisions clean and dry. You may shower, but do not soak in a tub or swim until cleared by your surgeon.",
      "Avoid lifting objects heavier than 5 kg or engaging in strenuous physical activity for the next 2-4 weeks.",
      "Take prescribed pain medication as directed. Do not take on an empty stomach.",
      "Resume a normal, healthy diet. Drink plenty of water and eat high-fiber foods to prevent constipation.",
      "Warning signs requiring immediate attention: Fever above 101°F, worsening abdominal pain, persistent nausea/vomiting, or redness/drainage from the incision sites.",
      "Follow up with Dr. Meera Sharma in the clinic in 7-10 days for a post-operative check and incision evaluation.",
    ],
  },
  medications: [
    {
      id: "med-1",
      displayName: "Ceftriaxone",
      dose: "1 g",
      frequency: "Every 24 hours",
      route: "IV injection",
    },
    {
      id: "med-2",
      displayName: "Paracetamol",
      dose: "500 mg",
      frequency: "As required",
      route: "Oral",
    },
    {
      id: "med-3",
      displayName: "Normal Saline",
      dose: "1000 mL",
      frequency: "Continuous",
      route: "IV infusion",
    },
    {
      id: "med-4",
      displayName: "Pantoprazole",
      dose: "40 mg",
      frequency: "Once daily",
      route: "Oral",
    },
  ],
  billing: {
    invoiceId: "inv-9081",
    invoiceReference: "9081",
    totalAmount: 45850,
    paidAmount: 45850,
    outstandingAmount: 0,
    status: "Paid",
  },
  history: [
    {
      id: "hist-1",
      eventType: "Admission created",
      title: "Admitted to Kaero Multispeciality Hospital",
      occurredAt: "2023-10-12T08:15:00Z",
    },
    {
      id: "hist-2",
      eventType: "Procedure completed",
      title: "Laparoscopic appendectomy performed",
      occurredAt: "2023-10-12T12:30:00Z",
    },
    {
      id: "hist-3",
      eventType: "Post-operative laboratory result added",
      title: "Complete Blood Count",
      occurredAt: "2023-10-13T07:00:00Z",
    },
    {
      id: "hist-4",
      eventType: "Discharge summary published",
      title: "Record finalized by Dr. Meera Sharma",
      occurredAt: "2023-10-15T14:30:00Z",
    },
  ],
  documents: [
    {
      id: "doc-1",
      title: "Discharge Summary",
      type: "Summary",
      mimeType: "application/pdf",
      sizeBytes: 1200000,
      createdAt: "2023-10-15T14:30:00Z",
      canDownload: true,
    },
    {
      id: "doc-2",
      title: "Pathology Report",
      type: "Report",
      mimeType: "application/pdf",
      sizeBytes: 850000,
      createdAt: "2023-10-14T11:00:00Z",
      canDownload: true,
    },
    {
      id: "doc-3",
      title: "Radiology Report",
      type: "Report",
      mimeType: "application/pdf",
      sizeBytes: 4500000,
      createdAt: "2023-10-12T09:30:00Z",
      canDownload: true,
    },
    {
      id: "doc-4",
      title: "Consent Form",
      type: "Form",
      mimeType: "application/pdf",
      sizeBytes: 620000,
      createdAt: "2023-10-12T08:45:00Z",
      canDownload: false,
    },
  ],
  permissions: {
    canView: true,
    canDownloadSummary: true,
    canScheduleFollowUp: true,
    canViewBilling: true,
  },
};

export const fetchAdmissionRecord = async (recordId: string): Promise<IpAdmissionRecord> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (recordId === "adm-denied") {
    const record = { ...MOCK_RECORD_ADM_88219, id: "adm-denied" };
    record.permissions = { ...record.permissions, canView: false };
    return record;
  }

  // Return mock for any other ID to make testing easy
  return { ...MOCK_RECORD_ADM_88219, id: recordId };
};

export const requestSummaryDownload = async (recordId: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (recordId !== "adm-88219") throw new Error("Not found");
  return `https://kaero.mock/download/summary/${recordId}?token=mock-secure-token`;
};

export const requestDocumentDownload = async (documentId: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `https://kaero.mock/download/document/${documentId}?token=mock-secure-token`;
};
