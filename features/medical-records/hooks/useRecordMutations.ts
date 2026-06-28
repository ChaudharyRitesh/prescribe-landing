"use client";

import { useState, useCallback } from "react";
import type { ExportStatus } from "../types/medicalRecords.types";

export const useRecordDownloadMutation = () => {
  const [status, setStatus] = useState<ExportStatus>("idle");

  const download = useCallback(async (recordId: string) => {
    setStatus("submitting");
    // Mock: simulate download
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("ready");
    setTimeout(() => setStatus("idle"), 2000);
  }, []);

  return { download, status, isDownloading: status === "submitting" };
};

export const useRecordExportMutation = () => {
  const [status, setStatus] = useState<ExportStatus>("idle");

  const exportRecords = useCallback(async (recordIds: string[]) => {
    if (recordIds.length === 0) return;
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 2000));
    setStatus("processing");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("ready");
    setTimeout(() => setStatus("idle"), 3000);
  }, []);

  const reset = useCallback(() => setStatus("idle"), []);

  return { exportRecords, status, reset, isExporting: status === "submitting" || status === "processing" };
};
