"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiClient } from "@/lib/api/axios";


interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  profileImage?: string;
  status: string;
  partner_token?: string;
}

interface DashboardStats {
  stats: {
    totalHospitals: number;
    conversions: number;
    estimatedCommission: number;
    activePitches: number;
  };
  recentActivity: any[];
  recentPitches: any[];
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface DashboardContextType {
  isNewPitchModalOpen: boolean;
  openNewPitchModal: () => void;
  closeNewPitchModal: () => void;
  userData: any | null;
  dashboardStats: DashboardStats | null;
  performanceData: any | null;
  pitches: any[];
  pitchesPagination: PaginationData | null;
  scheduleEvents: any[];
  schedulePagination: PaginationData | null;
  bankAccount: any | null;
  withdrawals: any[];
  withdrawalsPagination: PaginationData | null;
  expenses: any[];
  expensesPagination: PaginationData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  refreshDashboardStats: () => Promise<void>;
  refreshPitches: (page?: number, limit?: number) => Promise<void>;
  refreshPerformance: () => Promise<void>;
  refreshSchedule: (start?: string, end?: string, page?: number, limit?: number) => Promise<void>;
  refreshBankAccount: () => Promise<void>;
  refreshWithdrawals: (page?: number, limit?: number) => Promise<void>;
  refreshExpenses: (page?: number, limit?: number) => Promise<void>;
  addExpense: (data: any | FormData) => Promise<any>;
  updateExpense: (id: string, data: any | FormData) => Promise<any>;
  deleteExpense: (id: string) => Promise<any>;
  handleLogout: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [isNewPitchModalOpen, setIsNewPitchModalOpen] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [pitches, setPitches] = useState<any[]>([]);
  const [pitchesPagination, setPitchesPagination] = useState<PaginationData | null>(null);
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([]);
  const [schedulePagination, setSchedulePagination] = useState<PaginationData | null>(null);
  const [bankAccount, setBankAccount] = useState<any | null>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawalsPagination, setWithdrawalsPagination] = useState<PaginationData | null>(null);
  const [performanceData, setPerformanceData] = useState<any | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expensesPagination, setExpensesPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);

  const openNewPitchModal = () => setIsNewPitchModalOpen(true);
  const closeNewPitchModal = () => {
    setIsNewPitchModalOpen(false);
    refreshDashboardStats();
    refreshPitches();
    refreshPerformance();
    refreshSchedule();
  };

  const refreshUserData = async () => {
    try {
      const response: any = await apiClient.get("/mr/profile");
      if (response.success) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR user data:", error);
    }
  };

  const refreshDashboardStats = async () => {
    try {
      const response: any = await apiClient.get("/mr/dashboard/stats");
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPitches = async (page: number = 1, limit: number = 20) => {
    try {
      const response: any = await apiClient.get(`/mr/pitches?page=${page}&limit=${limit}`);
      if (response.success) {
        setPitches(response.data);
        if (response.pagination) setPitchesPagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch MR pitches:", error);
    }
  };

  const refreshPerformance = async () => {
    try {
      const response: any = await apiClient.get("/mr/performance");
      if (response.success) {
        setPerformanceData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR performance stats:", error);
    }
  };

  const refreshSchedule = async (start?: string, end?: string, page?: number, limit?: number) => {
    try {
      let url = "/mr/schedule";
      const params = new URLSearchParams();
      if (start) params.append("start", start);
      if (end) params.append("end", end);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response: any = await apiClient.get(url);
      if (response.success) {
        setScheduleEvents(response.data);
        if (response.pagination) setSchedulePagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch MR schedule:", error);
    }
  };

  const refreshWithdrawals = async (page: number = 1, limit: number = 20) => {
    try {
      const response: any = await apiClient.get(`/mr/withdrawals?page=${page}&limit=${limit}`);
      if (response.success) {
        setWithdrawals(response.data);
        if (response.pagination) setWithdrawalsPagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch MR withdrawals:", error);
    }
  };

  const refreshBankAccount = async () => {
    try {
      const response: any = await apiClient.get("/mr/bank-account");
      if (response.success) {
        setBankAccount(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MR bank account:", error);
    }
  };

  const refreshExpenses = async (page: number = 1, limit: number = 20) => {
    try {
      const response: any = await apiClient.get(`/mr/expenses?page=${page}&limit=${limit}`);
      if (response.success) {
        setExpenses(response.data);
        if (response.pagination) setExpensesPagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch MR expenses:", error);
    }
  };


  const addExpense = async (data: any | FormData) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response: any = await apiClient.post("/mr/expenses", data, config);
    if (response.success) refreshExpenses(expensesPagination?.page || 1);
    return response;
  };

  const updateExpense = async (id: string, data: any | FormData) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response: any = await apiClient.put(`/mr/expenses/${id}`, data, config);
    if (response.success) refreshExpenses(expensesPagination?.page || 1);
    return response;
  };

  const deleteExpense = async (id: string) => {
    const response: any = await apiClient.delete(`/mr/expenses/${id}`);
    if (response.success) refreshExpenses(expensesPagination?.page || 1);
    return response;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("partner_token");
      localStorage.removeItem("partner_user");
      document.cookie = "partner_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = "/partner/login";
    }
  };

  useEffect(() => {
    const isPublicRoute = window.location.pathname.includes("/login") || 
                         window.location.pathname.includes("/register") || 
                         window.location.pathname.includes("/verify-otp");
    
    // Check for token before initializing
    const token = localStorage.getItem("partner_token");
    if (!token && !isPublicRoute) {
      // Redirect if no token is found on protected routes
      // window.location.href = "/partner/login";
    }

    const init = async () => {
      await refreshUserData();
      await Promise.all([
        refreshDashboardStats(),
        refreshPitches(),
        refreshPerformance(),
        refreshSchedule(),
        refreshBankAccount(),
        refreshWithdrawals(),
        refreshExpenses()
      ]);
    };
    init();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        isNewPitchModalOpen,
        openNewPitchModal,
        closeNewPitchModal,
        userData,
        dashboardStats,
        performanceData,
        pitches,
        pitchesPagination,
        scheduleEvents,
        schedulePagination,
        bankAccount,
        withdrawals,
        withdrawalsPagination,
        expenses,
        expensesPagination,
        loading,
        refreshUserData,
        refreshDashboardStats,
        refreshPitches,
        refreshPerformance,
        refreshSchedule,
        refreshBankAccount,
        refreshWithdrawals,
        refreshExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        handleLogout
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
