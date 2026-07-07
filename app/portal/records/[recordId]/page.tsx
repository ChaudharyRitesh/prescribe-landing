"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Grid, Box, Alert, Typography, Button } from "@mui/material";

import { useAdmissionRecordQuery } from "@/features/medical-records/admission-detail/hooks/useAdmissionRecordQuery";
import { useRequestAdmissionSummaryDownloadMutation } from "@/features/medical-records/admission-detail/hooks/useAdmissionMutations";

import { AdmissionRecordHeader } from "@/features/medical-records/admission-detail/components/AdmissionRecordHeader";
import { RecordCorrectionBanner } from "@/features/medical-records/admission-detail/components/RecordCorrectionBanner";
import { AdmissionSummary } from "@/features/medical-records/admission-detail/components/AdmissionSummary";
import { ClinicalFindingsSection } from "@/features/medical-records/admission-detail/components/ClinicalFindingsSection";
import { DischargeInstructions } from "@/features/medical-records/admission-detail/components/DischargeInstructions";
import { AdmissionMedications } from "@/features/medical-records/admission-detail/components/AdmissionMedications";
import { AdmissionBillingSummary } from "@/features/medical-records/admission-detail/components/AdmissionBillingSummary";
import { RecordProvenance } from "@/features/medical-records/admission-detail/components/RecordProvenance";
import { RecordHistoryTimeline } from "@/features/medical-records/admission-detail/components/RecordHistoryTimeline";
import { RelatedDocuments } from "@/features/medical-records/admission-detail/components/RelatedDocuments";
import { AdmissionSupportPanel } from "@/features/medical-records/admission-detail/components/AdmissionSupportPanel";
import { AdmissionRecordSkeleton } from "@/features/medical-records/admission-detail/components/AdmissionRecordSkeleton";
import { FolderOffOutlinedIcon } from "@/shared/icons/patientPortalIcons";

export default function AdmissionRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.recordId as string;

  const { data: record, isLoading, error, refetch } = useAdmissionRecordQuery(recordId);
  const { mutate: downloadSummary, isDownloading } = useRequestAdmissionSummaryDownloadMutation();

  const handleDownloadSummary = async () => {
    if (!record) return;
    try {
      await downloadSummary(record.id);
    } catch (e) {
      // Error handled in hook state
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1440, mx: "auto" }}>
        <AdmissionRecordSkeleton />
      </Container>
    );
  }

  // Not found or network error
  if (error || !record) {
    const isPermissionError = error?.toLowerCase().includes("permission");
    
    return (
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ textAlign: "center", py: 10, maxWidth: 500, mx: "auto" }}>
          <FolderOffOutlinedIcon sx={{ fontSize: 64, color: "#D1D5DB", mb: 3 }} />
          <Typography variant="h5" fontWeight="700" color="#111827" gutterBottom>
            {isPermissionError ? "Permission Denied" : "Record Unavailable"}
          </Typography>
          <Typography variant="body1" color="#6B7280" sx={{ mb: 4, lineHeight: 1.6 }}>
            {isPermissionError 
              ? "You do not currently have permission to view this record. Please contact your healthcare provider for access."
              : error || "This medical record could not be found. It may have been removed or the ID is incorrect."}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/portal/records")}
              sx={{ textTransform: "none", borderRadius: "8px", color: "#374151", borderColor: "#D1D5DB" }}
            >
              Return to Medical Records
            </Button>
            {!isPermissionError && (
              <Button
                variant="contained"
                onClick={refetch}
                sx={{ textTransform: "none", borderRadius: "8px", bgcolor: "#6366F1", boxShadow: "none" }}
              >
                Retry
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    );
  }

  // Access check per spec
  if (!record.permissions.canView) {
    return (
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1440, mx: "auto" }}>
        <Box sx={{ textAlign: "center", py: 10, maxWidth: 500, mx: "auto" }}>
          <FolderOffOutlinedIcon sx={{ fontSize: 64, color: "#EF4444", mb: 3 }} />
          <Typography variant="h5" fontWeight="700" color="#111827" gutterBottom>
            Permission Denied
          </Typography>
          <Typography variant="body1" color="#6B7280" sx={{ mb: 4, lineHeight: 1.6 }}>
            You do not currently have permission to view this record.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push("/portal/records")}
            sx={{ textTransform: "none", borderRadius: "8px", color: "#374151", borderColor: "#D1D5DB" }}
          >
            Return to Medical Records
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1440, mx: "auto" }}>
      <AdmissionRecordHeader 
        record={record}
        onDownloadSummary={handleDownloadSummary}
        isDownloading={isDownloading}
      />

      <RecordCorrectionBanner status={record.status} />

      <Grid container spacing={4}>
        {/* Main Clinical Content (8 columns) */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 2, md: 1 } }}>
          <AdmissionSummary record={record} />
          <ClinicalFindingsSection clinicalSections={record.clinicalSections} />
          <DischargeInstructions instructions={record.clinicalSections.dischargeInstructions} />
          <AdmissionMedications medications={record.medications} />
          {record.permissions.canViewBilling && (
            <AdmissionBillingSummary billing={record.billing} />
          )}
        </Grid>

        {/* Right Rail Context (4 columns) */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 1, md: 2 } }}>
          <RecordProvenance source={record.source} />
          <RecordHistoryTimeline history={record.history} />
          <RelatedDocuments documents={record.documents} />
          <AdmissionSupportPanel />
        </Grid>
      </Grid>
    </Container>
  );
}
