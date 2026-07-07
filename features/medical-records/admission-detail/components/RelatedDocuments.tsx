"use client";

import React, { useState } from "react";
import { Box, Typography, Card, CardContent, IconButton, CircularProgress, Tooltip } from "@mui/material";
import { DescriptionOutlinedIcon, DownloadOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";
import { useRequestRelatedDocumentDownloadMutation } from "../hooks/useAdmissionMutations";

interface RelatedDocumentsProps {
  documents: IpAdmissionRecord["documents"];
}

export const RelatedDocuments = ({ documents }: RelatedDocumentsProps) => {
  const { mutate: downloadDoc, isDownloading } = useRequestRelatedDocumentDownloadMutation();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!documents || documents.length === 0) return null;

  const handleDownload = async (docId: string) => {
    setDownloadingId(docId);
    try {
      await downloadDoc(docId);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "none", mb: 4 }}>
      <CardContent sx={{ p: 3, pb: "24px !important" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{ bgcolor: "#F3F4F6", color: "#4B5563", p: 1, borderRadius: "8px", display: "flex" }}>
            <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700" color="#111827">
            Related Documents
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {documents.map((doc) => (
            <Box key={doc.id} sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#111827" sx={{ mb: 0.25 }}>
                  {doc.title}
                </Typography>
                <Typography variant="caption" color="#6B7280" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {doc.mimeType.split('/')[1]?.toUpperCase() || 'DOCUMENT'} {doc.sizeBytes ? `· ${formatSize(doc.sizeBytes)}` : ""}
                </Typography>
              </Box>
              
              <Tooltip title={doc.canDownload ? "Download document" : "Not available for download"}>
                <span>
                  <IconButton 
                    aria-label={`Download ${doc.title}`}
                    disabled={!doc.canDownload || (isDownloading && downloadingId === doc.id)}
                    onClick={() => handleDownload(doc.id)}
                    sx={{ 
                      width: 44,
                      height: 44,
                      color: "#374151", 
                      bgcolor: "#F3F4F6", 
                      "&:hover": { bgcolor: "#E5E7EB" },
                      "&.Mui-disabled": { color: "#9CA3AF", bgcolor: "#F9FAFB" }
                    }}
                  >
                    {isDownloading && downloadingId === doc.id ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <DownloadOutlinedIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
