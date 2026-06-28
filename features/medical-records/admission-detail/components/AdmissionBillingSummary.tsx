"use client";

import React from "react";
import { Box, Typography, Button, Divider, Tooltip } from "@mui/material";
import { ReceiptLongOutlinedIcon, OpenInNewOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";

interface AdmissionBillingSummaryProps {
  billing?: IpAdmissionRecord["billing"];
}

export const AdmissionBillingSummary = ({ billing }: AdmissionBillingSummaryProps) => {
  if (!billing) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ mb: 4, borderRadius: "12px", border: "1px solid #E5E7EB", bgcolor: "#FFFFFF", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ bgcolor: "#F3F4F6", color: "#4B5563", p: 1, borderRadius: "8px", display: "flex" }}>
            <ReceiptLongOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700" color="#111827">
            Associated Bill
          </Typography>
        </Box>
        <Tooltip title="Billing portal will be available in a later phase">
          <span>
            <Button
              variant="text"
              size="small"
              endIcon={<OpenInNewOutlinedIcon />}
              disabled
              sx={{ 
                textTransform: "none", 
                fontWeight: 600,
                "&.Mui-disabled": { color: "#9CA3AF" }
              }}
            >
              View invoice
            </Button>
          </span>
        </Tooltip>
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="caption" color="#6B7280" sx={{ display: "block", mb: 2 }}>
          Invoice reference: •••• {billing.invoiceReference.slice(-4)}
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="#4B5563">Total Amount</Typography>
          <Typography variant="body2" fontWeight="600" color="#111827">{formatCurrency(billing.totalAmount)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="#4B5563">Paid Amount</Typography>
          <Typography variant="body2" color="#059669">{formatCurrency(billing.paidAmount)}</Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" fontWeight="700" color="#111827">Outstanding Amount</Typography>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body1" fontWeight="800" color={billing.outstandingAmount > 0 ? "#DC2626" : "#111827"}>
              {formatCurrency(billing.outstandingAmount)}
            </Typography>
            <Typography variant="caption" color="#6B7280" sx={{ fontWeight: 500, textTransform: "uppercase" }}>
              Status: {billing.status}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
