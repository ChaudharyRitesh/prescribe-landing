"use client";

import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { HistoryOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";

interface RecordHistoryTimelineProps {
  history: IpAdmissionRecord["history"];
}

export const RecordHistoryTimeline = ({ history }: RecordHistoryTimelineProps) => {
  if (!history || history.length === 0) return null;

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(isoString));
  };

  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "none", mb: 4 }}>
      <CardContent sx={{ p: 3, pb: "24px !important" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{ bgcolor: "#F3F4F6", color: "#4B5563", p: 1, borderRadius: "8px", display: "flex" }}>
            <HistoryOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700" color="#111827">
            Record History
          </Typography>
        </Box>

        <Box sx={{ position: "relative", ml: 2, pl: 3, borderLeft: "2px solid #E5E7EB" }}>
          {history.map((event, idx) => (
            <Box key={event.id} sx={{ position: "relative", mb: idx === history.length - 1 ? 0 : 3 }}>
              {/* Timeline dot */}
              <Box
                sx={{
                  position: "absolute",
                  left: -24 - 5, // -paddingLeft - dot radius
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: idx === 0 ? "#6366F1" : "#D1D5DB",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 0 0 1px #E5E7EB",
                }}
              />
              <Typography variant="caption" color="#6B7280" sx={{ display: "block", mb: 0.5 }}>
                {formatDate(event.occurredAt)}
              </Typography>
              <Typography variant="body2" fontWeight="600" color="#111827" sx={{ mb: 0.25 }}>
                {event.eventType}
              </Typography>
              <Typography variant="body2" color="#4B5563">
                {event.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
