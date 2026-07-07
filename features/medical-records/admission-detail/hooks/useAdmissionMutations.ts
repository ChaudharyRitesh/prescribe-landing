"use client";

import { useState, useCallback } from "react";
import { requestSummaryDownload, requestDocumentDownload } from "../api/admissionRecord.api";

export type DownloadStatus = "idle" | "requesting" | "ready" | "failed";

export const useRequestAdmissionSummaryDownloadMutation = () => {
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (recordId: string) => {
    setStatus("requesting");
    setError(null);
    try {
      const url = await requestSummaryDownload(recordId);
      setStatus("ready");
      // Mock: auto-reset after 3s
      setTimeout(() => setStatus("idle"), 3000);
      return url;
    } catch (err: any) {
      setStatus("failed");
      setError(err.message || "Download failed");
      setTimeout(() => setStatus("idle"), 3000);
      throw err;
    }
  }, []);

  return { mutate, status, error, isDownloading: status === "requesting" };
};

export const useRequestRelatedDocumentDownloadMutation = () => {
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (documentId: string) => {
    setStatus("requesting");
    setError(null);
    try {
      const url = await requestDocumentDownload(documentId);
      setStatus("ready");
      setTimeout(() => setStatus("idle"), 3000);
      return url;
    } catch (err: any) {
      setStatus("failed");
      setError(err.message || "Download failed");
      setTimeout(() => setStatus("idle"), 3000);
      throw err;
    }
  }, []);

  return { mutate, status, error, isDownloading: status === "requesting" };
};
