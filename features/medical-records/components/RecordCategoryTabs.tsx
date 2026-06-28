"use client";

import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import {
  FolderSharedOutlinedIcon,
  DescriptionOutlinedIcon,
  MedicationOutlinedIcon,
  ScienceOutlinedIcon,
  LocalHospitalOutlinedIcon,
  ReceiptLongOutlinedIcon,
} from "@/shared/icons/patientPortalIcons";
import type { RecordCategory } from "../types/medicalRecords.types";
import { CATEGORY_LABELS } from "../types/medicalRecords.types";

const CATEGORY_ICONS: Record<RecordCategory, React.ReactElement> = {
  all: <FolderSharedOutlinedIcon sx={{ fontSize: 18 }} />,
  clinical: <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />,
  prescription: <MedicationOutlinedIcon sx={{ fontSize: 18 }} />,
  laboratory: <ScienceOutlinedIcon sx={{ fontSize: 18 }} />,
  admission: <LocalHospitalOutlinedIcon sx={{ fontSize: 18 }} />,
  billing: <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />,
};

const CATEGORIES: RecordCategory[] = ["all", "clinical", "prescription", "laboratory", "admission", "billing"];

interface RecordCategoryTabsProps {
  value: RecordCategory;
  onChange: (category: RecordCategory) => void;
}

export const RecordCategoryTabs = ({ value, onChange }: RecordCategoryTabsProps) => {
  return (
    <Box sx={{ borderBottom: "2px solid #E5E7EB", mb: 3 }}>
      <Tabs
        value={value}
        onChange={(_, v) => onChange(v as RecordCategory)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 48,
          "& .MuiTabs-indicator": {
            display: "block",
            bgcolor: "#6366F1",
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            minHeight: 48,
            borderRadius: 0,
            background: "none",
            color: "#6B7280",
            px: 2,
            "&.Mui-selected": {
              color: "#6366F1",
              background: "none",
            },
          },
        }}
      >
        {CATEGORIES.map((cat) => (
          <Tab
            key={cat}
            value={cat}
            label={CATEGORY_LABELS[cat]}
            icon={CATEGORY_ICONS[cat]}
            iconPosition="start"
          />
        ))}
      </Tabs>
    </Box>
  );
};
