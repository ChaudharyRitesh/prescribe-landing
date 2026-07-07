"use client";

import { useState, useEffect, useCallback } from "react";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";
import { fetchAdmissionRecord } from "../api/admissionRecord.api";

export const useAdmissionRecordQuery = (recordId: string) => {
  const [data, setData] = useState<IpAdmissionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecord = useCallback(async () => {
    if (!recordId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const record = await fetchAdmissionRecord(recordId);
      setData(record);
    } catch (err: any) {
      setError(err.message || "Failed to load record");
    } finally {
      setIsLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  return { data, isLoading, error, refetch: fetchRecord };
};
